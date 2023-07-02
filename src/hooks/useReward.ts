import config from '@/config'
import { calculateGasBuffer } from '@/utils/LockOverviewUtils'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { CHECKPOINT_GAS_LIMIT, YIELD_GAS_LIMIT } from '@/data/LockConstants'
import { hiIQReward } from '@/abis/hiIQReward.abi'
import { formatEther } from 'viem'

export const useReward = () => {
  const { address } = useAccount()

  const {
    data: totalRewardEarned,
    isLoading: isFetchingTotalReward,
    refetch: refetchTotalRewardEarned,
  } = useContractRead({
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: hiIQReward,
    functionName: 'earned',
    args: [address as `0x${string}`],
  })

  const { data: userHiiqCheckPointed } = useContractRead({
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: hiIQReward,
    functionName: 'userHiIQCheckpointed',
    args: [address as `0x${string}`],
  })

  const { data: userIsInitializedData } = useContractRead({
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: hiIQReward,
    functionName: 'userIsInitialized',
    args: [address as `0x${string}`],
  })

  const { data: checkpointData } = useContractWrite({
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: hiIQReward,
    functionName: 'checkpoint',
    gas: BigInt(calculateGasBuffer(CHECKPOINT_GAS_LIMIT)),
  })

  const { data: getYieldData } = useContractWrite({
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: hiIQReward,
    functionName: 'getYield',
    gas: BigInt(calculateGasBuffer(YIELD_GAS_LIMIT)),
  })

  const getTotalRewardEarned = async () => {
    if (totalRewardEarned) {
      const result = Number(formatEther(totalRewardEarned))
      if (result > 0) {
        return result
      }
    }
    return 0
  }

  const getUserHiiqCheckpointed = () => {
    if (userHiiqCheckPointed) {
      const result = Number(formatEther(userHiiqCheckPointed))
      if (result > 0) {
        return result
      }
    }
    return 0
  }

  const checkPoint = async () => {
    return checkpointData
  }

  const getYield = async () => {
    return getYieldData
  }

  const checkIfUserIsInitialized = async () => {
    if (address) {
      try {
        const result = userIsInitializedData
        return result
      } catch (_err) {
        return false
      }
    }
    return false
  }

  return {
    totalRewardEarned,
    isFetchingTotalReward,
    rewardEarned: () => getTotalRewardEarned(),
    checkPoint: () => checkPoint(),
    checkIfUserIsInitialized: () => checkIfUserIsInitialized(),
    getYield: () => getYield(),
    userHiiqCheckPointed: getUserHiiqCheckpointed(),
    refetchTotalRewardEarned: () => refetchTotalRewardEarned(),
  }
}
