import { useContractWrite, useContractRead, useAccount } from 'wagmi'
import config from '@/config'
import { nftFarmAbi } from '@/abis/nftfarm.abi'
import { utils } from 'ethers'
import { shortenBalance } from '@/utils/dashboard-utils'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  addressOrName: config.nftFarmAddress,
  contractInterface: nftFarmAbi,
}

export const useNFTGauge = () => {
  const { address } = useAccount()
  const { data: earnedData, refetch: refetchEarnedData } = useContractRead({
    ...contractConfig,
    functionName: 'earned',
    args: [address],
  })

  const { data: lockedStakes, refetch: refetchLockedStakes } = useContractRead({
    ...contractConfig,
    functionName: 'lockedStakesOf',
    args: [address],
  })

  const { writeAsync: getReward } = useContractWrite({
    ...contractConfig,
    functionName: 'getReward',
  })

  const { writeAsync: lockBrainy } = useContractWrite({
    ...contractConfig,
    functionName: 'stakeLocked',
  })

  const { writeAsync: unlock } = useContractWrite({
    ...contractConfig,
    functionName: 'withdrawLocked',
  })

  const { data: totalLiquidityLocked } = useContractRead({
    ...contractConfig,
    functionName: 'totalLiquidityLocked',
  })

  const claimReward = async (destinationAddress: string) => {
    try {
      const { wait: waitForTheClaim } = await await getReward({
        args: [destinationAddress],
      })

      await waitForTheClaim(2)
      await refetchEarnedData()

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Rewards claimed successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const getEarnedData = () => {
    if (earnedData)
      return shortenBalance(Number(utils.formatEther(earnedData[0])))

    return 0
  }

  const getTotalLiquidityLocked = () => {
    if (totalLiquidityLocked)
      return Number(utils.formatEther(totalLiquidityLocked))* 10e17
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
      const { wait: waitForTheLock } = await lockBrainy({
        args: [tokenId, days * 86400],
      })
      await waitForTheLock(2)
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
      const { wait: waitForTheUnlock } = await unlock({
        args: [kek_id, address],
      })
      await waitForTheUnlock()
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
    totalLiquidityLocked: getTotalLiquidityLocked()
  }
}
