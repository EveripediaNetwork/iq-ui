import { rewardsDistributorAbi } from "@/abis/rewardsdistributor.abi"
import config from "@/config"
import { useContractRead } from "wagmi"

const contractConfig = {
  addressOrName: config.gaugeCtrlAddress,
  contractInterface: rewardsDistributorAbi,
}

type HookType = {
  gaugeAddress: string
}

export const useRewardsDistributor = ({ gaugeAddress }: HookType) => {
  const { data: currentReward } = useContractRead({
    ...contractConfig,
    functionName: 'currentReward',
    args: [gaugeAddress]
  })

  const getWeeklyReward = () => {
    console.log(currentReward)
    if (currentReward)
      return currentReward.toString()

    return '0'
  }

  return {
    weeklyReward: getWeeklyReward()
  }
}