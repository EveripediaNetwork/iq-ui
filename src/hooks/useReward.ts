import config from '@/config'
import { hiIQRewardABI } from '@/config/abis'
import { formatContractResult, getDollarValue } from '@/utils/LockOverviewUtils'
import { ContractInterface } from '@ethersproject/contracts'
import { useAccount, useContractRead } from 'wagmi'

const readContract = {
  addressOrName: config.hiiqRewardAddress,
  contractInterface: hiIQRewardABI as ContractInterface,
  watch: true,
}

export const useReward = () => {
  const { address } = useAccount()
  const { data: totalRewardEarned, isLoading: isFetchingTotalReward } =
    useContractRead({
      ...readContract,
      functionName: 'earned',
      args: [address],
    })

  const getTotalRewardEarned = async () => {
    if (totalRewardEarned) {
      const result = formatContractResult(totalRewardEarned)
      if (result > 0) {
        const rate = await getDollarValue()
        return rate * result
      }
      return 0
    }
    return 0
  }

  return {
    totalRewardEarned,
    isFetchingTotalReward,
    rewardEarned: () => getTotalRewardEarned(),
  }
}
