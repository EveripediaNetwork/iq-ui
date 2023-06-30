import config from '@/config'
import { shortenBalance } from '@/utils/dashboard-utils'
import { formatEther } from 'viem'
import { useContractRead } from 'wagmi'

type HookType = {
  gaugeAddress: string
}

export const useRewardsDistributor = ({ gaugeAddress }: HookType) => {
  const { data: currentReward } = useContractRead({
    address: config.gaugeRewardsDistributorAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'gauge_address', type: 'address' },
        ],
        name: 'currentReward',
        outputs: [
          { internalType: 'uint256', name: 'reward_amount', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'currentReward',
    args: [gaugeAddress as `0x${string}`],
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
