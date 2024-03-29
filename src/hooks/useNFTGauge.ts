import { useContractWrite, useContractRead, useAccount } from 'wagmi'
import nftFarmAbi from '@/abis/nftfarm.abi'
import { shortenBalance } from '@/utils/dashboard-utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { formatEther, stringToHex } from 'viem'
import { waitForTransaction } from 'wagmi/actions'

type ErrorResponse = {
  reason: string
}

export const useNFTGauge = () => {
  const { address } = useAccount()
  const { currentStakingAddress } = useSelector(
    (state: RootState) => state.nftFarms,
  )
  const contractConfig = {
    address: currentStakingAddress as `0x${string}`,
    abi: nftFarmAbi,
  }
  const { data: earnedData, refetch: refetchEarnedData } = useContractRead({
    address: currentStakingAddress as `0x${string}`,
    abi: nftFarmAbi,
    functionName: 'earned',
    args: [address as `0x${string}`],
  })

  const { data: lockedStakes, refetch: refetchLockedStakes } = useContractRead({
    address: currentStakingAddress as `0x${string}`,
    abi: nftFarmAbi,
    functionName: 'lockedStakesOf',
    args: [address as `0x${string}`],
  })

  const { writeAsync: getReward } = useContractWrite({
    ...contractConfig,
    functionName: 'getReward',
  })

  const { writeAsync: lockBrainy } = useContractWrite({
    ...contractConfig,
    functionName: 'stakeLocked',
  })

  const { writeAsync: lockMoreBrainy } = useContractWrite({
    ...contractConfig,
    functionName: 'lockAdditional',
  })

  const { writeAsync: increaseStakeTime } = useContractWrite({
    ...contractConfig,
    functionName: 'lockLonger',
  })

  const { writeAsync: unlock } = useContractWrite({
    ...contractConfig,
    functionName: 'withdrawLocked',
  })

  const { data: totalLiquidityLocked, refetch: refetchTotalLiquidityLocked } =
    useContractRead({
      address: currentStakingAddress as `0x${string}`,
      abi: nftFarmAbi,
      functionName: 'totalLiquidityLocked',
    })

  const claimReward = async (destinationAddress: string) => {
    try {
      const { hash: waitForTheClaimHash } = await getReward({
        args: [destinationAddress as `0x${string}`],
      })
      await waitForTransaction({ hash: waitForTheClaimHash })
      await refetchEarnedData()
      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Rewards claimed successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const getEarnedData = () => {
    if (earnedData) return shortenBalance(Number(formatEther(earnedData[0])))

    return 0
  }

  const getTotalLiquidityLocked = () => {
    if (totalLiquidityLocked)
      return (
        Number(formatEther(BigInt(totalLiquidityLocked?.toString() ?? 0))) *
        10e17
      )
    return 0
  }

  const getLockedStakes = () => {
    if (lockedStakes) {
      const stakes = []
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < lockedStakes.length; i++) {
        const stake = lockedStakes[i]
        const liquidity = Number(stake.liquidity.toString())
        const endingTimestamp = new Date(
          Number(stake.ending_timestamp.toString()) * 1000,
        )

        if (liquidity > 0) {
          stakes.push({
            startTimestamp: new Date(
              Number(stake.start_timestamp.toString()) * 1000,
            ).toUTCString(),
            endingTimestamp: endingTimestamp.toUTCString(),
            expired: endingTimestamp.getTime() < new Date().getTime(),
            kek_id: stake.kek_id,
          })
        }
      }

      return stakes
    }
    return []
  }

  const stakeYourBrainy = async (tokenId: number, days: number) => {
    try {
      const { hash: waitForTheLockHash } = await lockBrainy({
        args: [BigInt(tokenId), BigInt(days * 86400)],
      })
      await waitForTransaction({ hash: waitForTheLockHash })
      await refetchLockedStakes()
      refetchTotalLiquidityLocked()
      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Brainy locked successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const stakeMoreBrainy = async (tokenId: number, key: number) => {
    try {
      const { hash: waitForTheLockHash } = await lockMoreBrainy({
        args: [stringToHex(key.toString()), BigInt(tokenId)],
      })
      await waitForTransaction({ hash: waitForTheLockHash })
      await refetchLockedStakes()
      refetchTotalLiquidityLocked()
      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Brainy locked successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const increaseStakePeriod = async (timestamp: number, key: number) => {
    try {
      const { hash: waitForTheLockHash } = await increaseStakeTime({
        args: [stringToHex(key.toString()), BigInt(timestamp)],
      })
      await waitForTransaction({ hash: waitForTheLockHash })
      await refetchLockedStakes()

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Brainy locked successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const performStakesUnlocking = async (kek_id: string) => {
    try {
      const { hash: waitForTheUnlockHash } = await unlock({
        args: [stringToHex(kek_id.toString()), address as `0x${string}`],
      })
      await waitForTransaction({ hash: waitForTheUnlockHash })
      await refetchEarnedData()
      getLockedStakes()
      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Stake unlocked successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  return {
    claimReward,
    earned: getEarnedData(),
    lockedStakes: getLockedStakes(),
    stake: (tokenId: number, days: number) => stakeYourBrainy(tokenId, days),
    unlockStakes: (kek_id: string) => performStakesUnlocking(kek_id),
    totalLiquidityLocked: getTotalLiquidityLocked(),
    refetchTotalLiquidityLocked: () => refetchTotalLiquidityLocked(),
    increaseStakePeriod: (days: number, key: number) =>
      increaseStakePeriod(days, key),
    stakeMoreBrainy: (tokenId: number, key: number) =>
      stakeMoreBrainy(tokenId, key),
  }
}
