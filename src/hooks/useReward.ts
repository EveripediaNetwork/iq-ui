import config from '@/config'
import { calculateGasBuffer } from '@/utils/LockOverviewUtils'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { CHECKPOINT_GAS_LIMIT, YIELD_GAS_LIMIT } from '@/data/LockConstants'
import { hiIQReward } from '@/abis/hiIQReward.abi'
import { formatEther } from 'viem'

export const useReward = () => {
  const { address } = useAccount()

  const contractConfig = {
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: hiIQReward,
  }

  const {
    data: totalRewardEarned,
    isLoading: isFetchingTotalReward,
    refetch: refetchTotalRewardEarned,
  } = useContractRead({
    ...contractConfig,
    functionName: 'earned',
    args: [address as `0x${string}`],
  })

  const { data: userHiiqCheckPointed } = useContractRead({
    ...contractConfig,
    functionName: 'userHiIQCheckpointed',
    args: [address as `0x${string}`],
  })

  const { data: userIsInitializedData } = useContractRead({
    ...contractConfig,
    functionName: 'userIsInitialized',
    args: [address as `0x${string}`],
  })

  const { writeAsync: checkpointData } = useContractWrite({
    ...contractConfig,
    functionName: 'checkpoint',
    gas: BigInt(calculateGasBuffer(CHECKPOINT_GAS_LIMIT)),
  })

  const { writeAsync: getYieldData } = useContractWrite({
    ...contractConfig,
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
    const result = await checkpointData()
    return result
  }

  const refetchData = async () => {
    const result = await refetchTotalRewardEarned()
    return result
  }

  const getYield = async () => {
    const result = await getYieldData()
    return result
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
    refetchTotalRewardEarned: () => refetchData(),
  }
}
