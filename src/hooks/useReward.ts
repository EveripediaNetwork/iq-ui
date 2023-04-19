import config from '@/config'
import { hiIQRewardABI } from '@/config/abis'
import {
  calculateGasBuffer,
  formatContractResult,
} from '@/utils/LockOverviewUtils'
import { useAccount, useContractRead, useContract, useSigner } from 'wagmi'
import { CHECKPOINT_GAS_LIMIT, YIELD_GAS_LIMIT } from '@/data/LockConstants'
import { parseAbiParameters } from 'viem'

const readContract = {
  addressOrName: config.hiiqRewardAddress,
  contractInterface: parseAbiParameters(hiIQRewardABI.toString()),
}

export const useReward = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const hiiqReward = useContract({
    ...readContract,
    signerOrProvider: signer,
  })

  const {
    data: totalRewardEarned,
    isLoading: isFetchingTotalReward,
    refetch: refetchTotalRewardEarned,
  } = useContractRead({
    ...readContract,
    functionName: 'earned',
    args: [address],
  })

  const { data: userHiiqCheckPointed } = useContractRead({
    ...readContract,
    functionName: 'userHiIQCheckpointed',
    args: [address],
  })

  const getTotalRewardEarned = async () => {
    if (totalRewardEarned) {
      const result = formatContractResult(
        totalRewardEarned as unknown as string,
      )
      if (result > 0) {
        return result
      }
    }
    return 0
  }

  const getUserHiiqCheckpointed = () => {
    if (userHiiqCheckPointed) {
      const result = formatContractResult(
        userHiiqCheckPointed as unknown as string,
      )
      if (result > 0) {
        return result
      }
    }
    return 0
  }

  const checkPoint = async () => {
    const result = await hiiqReward.checkpoint({
      gasLimit: calculateGasBuffer(CHECKPOINT_GAS_LIMIT),
    })
    return result
  }

  const getYield = async () => {
    const result = await hiiqReward.getYield({
      gasLimit: calculateGasBuffer(YIELD_GAS_LIMIT),
    })
    return result
  }

  const checkIfUserIsInitialized = async () => {
    if (address) {
      try {
        const result = await hiiqReward.userIsInitialized(address)
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
