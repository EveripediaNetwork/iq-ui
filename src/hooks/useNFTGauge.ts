import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import nftFarmAbi from '@/abis/nftfarm.abi'
import { shortenBalance } from '@/utils/dashboard-utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { formatEther, stringToHex } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { wagmiConfig } from '@/config/wagmi'

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
  const { data: earnedData, refetch: refetchEarnedData } = useReadContract({
    address: currentStakingAddress as `0x${string}`,
    abi: nftFarmAbi,
    functionName: 'earned',
    args: [address as `0x${string}`],
  })

  const { data: lockedStakes, refetch: refetchLockedStakes } = useReadContract({
    address: currentStakingAddress as `0x${string}`,
    abi: nftFarmAbi,
    functionName: 'lockedStakesOf',
    args: [address as `0x${string}`],
  })
  const { data: getRewardHash, writeContract: getReward } = useWriteContract()

  // const { writeAsync: getReward } = useContractWrite({
  //   ...contractConfig,
  //   functionName: 'getReward',
  // })

  const { data: lockBrainyHash, writeContractAsync: lockBrainy } =
    useWriteContract()

  // const { writeAsync: lockBrainy } = useContractWrite({
  //   ...contractConfig,
  //   functionName: 'stakeLocked',
  // })

  const { data: lockMoreBrainyHash, writeContractAsync: lockMoreBrainy } =
    useWriteContract()

  // const { writeAsync: lockMoreBrainy } = useContractWrite({
  //   ...contractConfig,
  //   functionName: 'lockAdditional',
  // })

  const { data: increaseStakeTimeHash, writeContractAsync: increaseStakeTime } =
    useWriteContract()

  // const { writeAsync: increaseStakeTime } = useContractWrite({
  //   ...contractConfig,
  //   functionName: 'lockLonger',
  // })

  const { data: unlockHash, writeContractAsync: unlock } = useWriteContract()

  // const { writeAsync: unlock } = useContractWrite({
  //   ...contractConfig,
  //   functionName: 'withdrawLocked',
  // })

  const { data: totalLiquidityLocked, refetch: refetchTotalLiquidityLocked } =
    useReadContract({
      address: currentStakingAddress as `0x${string}`,
      abi: nftFarmAbi,
      functionName: 'totalLiquidityLocked',
    })

  const claimReward = async (destinationAddress: string) => {
    try {
      await getReward({
        ...contractConfig,
        functionName: 'getReward',
        args: [destinationAddress as `0x${string}`],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: getRewardHash as `0x${string}`,
      })
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
      await lockBrainy({
        ...contractConfig,
        functionName: 'stakeLocked',
        args: [BigInt(tokenId), BigInt(days * 86400)],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: lockBrainyHash as `0x${string}`,
      })
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
      await lockMoreBrainy({
        ...contractConfig,
        functionName: 'lockAdditional',
        args: [stringToHex(key.toString()), BigInt(tokenId)],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: lockMoreBrainyHash as `0x${string}`,
      })
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
      await increaseStakeTime({
        ...contractConfig,
        functionName: 'lockLonger',
        args: [stringToHex(key.toString()), BigInt(timestamp)],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: increaseStakeTimeHash as `0x${string}`,
      })
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
      await unlock({
        ...contractConfig,
        functionName: 'withdrawLocked',
        args: [stringToHex(kek_id.toString()), address as `0x${string}`],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: unlockHash as `0x${string}`,
      })
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
