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
  const { data: earnedData } = useContractRead({
    ...contractConfig,
    functionName: 'earned',
    args: [address],
    // watch: true,
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

  const claimReward = async (destinationAddress: string) => {
    const result = await (
      await getReward({ args: [destinationAddress] })
    ).wait()

    return result
  }

  const getEarnedData = () => {
    if (earnedData)
      return shortenBalance(Number(utils.formatEther(earnedData[0])))

    return 0
  }

  const getLockedStakes = () => {
    if (lockedStakes) {
      const stakes = []
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < lockedStakes.length; i++) {
        const stake = lockedStakes[i]
        stakes.push({
          startTimestamp: new Date(
            Number(stake.start_timestamp.toString()) * 1000,
          ).toUTCString(),
          endingTimestamp: new Date(
            Number(stake.ending_timestamp.toString()) * 1000,
          ).toUTCString(),
        })
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

  return {
    claimReward,
    earned: getEarnedData(),
    lockedStakes: getLockedStakes(),
    stake: (tokenId: number, days: number) => stakeYourBrainy(tokenId, days),
  }
}
