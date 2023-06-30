import config from '@/config'
import { hiIQRewardABI } from '@/config/abis'
import {
  calculateGasBuffer,
  formatContractResult,
} from '@/utils/LockOverviewUtils'
import { useAccount, useContractRead, useContract, useSigner } from 'wagmi'
import { CHECKPOINT_GAS_LIMIT, YIELD_GAS_LIMIT } from '@/data/LockConstants'

const readContract = {
  addressOrName: config.hiiqRewardAddress,
  contractInterface: hiIQRewardABI,
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
    address: config.hiiqRewardAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'earned',
        outputs: [
          {
            internalType: 'uint256[]',
            name: 'new_earned',
            type: 'uint256[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'earned',
    args: [address as `0x${string}`],
  })

  const { data: userHiiqCheckPointed } = useContractRead({
    ...readContract,
    functionName: 'userHiIQCheckpointed',
    args: [address],
  })

  const getTotalRewardEarned = async () => {
    if (totalRewardEarned) {
      const result = formatContractResult(totalRewardEarned.toString())
      if (result > 0) {
        return result
      }
    }
    return 0
  }

  const getUserHiiqCheckpointed = () => {
    if (userHiiqCheckPointed) {
      const result = formatContractResult(userHiiqCheckPointed.toString())
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
