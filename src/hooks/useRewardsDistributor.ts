import { rewardsDistributorAbi } from '@/abis/rewardsdistributor.abi'
import config from '@/config'
import { shortenBalance } from '@/utils/dashboard-utils'
import { formatEther } from 'viem'
import { useContractRead } from 'wagmi'

const contractConfig = {
  addressOrName: config.gaugeRewardsDistributorAddress,
  contractInterface: rewardsDistributorAbi,
}

type HookType = {
  gaugeAddress: string
}

export const useRewardsDistributor = ({ gaugeAddress }: HookType) => {
  const { data: currentReward } = useContractRead({
    ...contractConfig,
    functionName: 'currentReward',
    args: [gaugeAddress],
  })

  const getWeeklyReward = () => {
    if (currentReward)
      return shortenBalance(
        Number(formatEther(BigInt(currentReward?.toString() ?? 0))),
      )

    return '0'
  }

  return {
    weeklyReward: getWeeklyReward(),
  }
}
