import config from '@/config'
import { hiIQRewardABI } from '@/config/abis'
import {
  calculateGasBuffer,
  formatContractResult,
} from '@/utils/LockOverviewUtils'
import {
  useAccount,
  useContractRead,
  useWalletClient,
} from 'wagmi'
import { getContract, GetWalletClientResult } from '@wagmi/core'
import { CHECKPOINT_GAS_LIMIT, YIELD_GAS_LIMIT } from '@/data/LockConstants'

const readContract = {
  address: config.hiiqRewardAddress as `0x${string}`,
  abi: hiIQRewardABI ,
}

interface HiiqReward {
  checkpoint: (options: { gasLimit: number }) => Promise<any>
  getYield: (options: { gasLimit: number }) => Promise<any>
  userIsInitialized: (address: `0x${string}`) => Promise<any>
  // other properties...
}

export const useReward = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient() // use as signer 
  

  const hiiqReward = getContract({
    ...readContract,
    //walletClient: walletClient as GetWalletClientResult
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
    args: [address as `0x${string}`],
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
    const { checkpoint } = hiiqReward as unknown as HiiqReward // TODO: fix this, it's a hack to get around the fact that the type of hiiqReward is not correct, it's missing the checkpoint function, which is why we have to cast it
    const result = await checkpoint({
      gasLimit: calculateGasBuffer(CHECKPOINT_GAS_LIMIT),
    })
    return result
  }

  const getYield = async () => {
    const { getYield } = hiiqReward as unknown as HiiqReward
    const result = await getYield({
      gasLimit: calculateGasBuffer(YIELD_GAS_LIMIT),
    })
    return result
  }

  const checkIfUserIsInitialized = async () => {
    if (address) {
      try {
        const { userIsInitialized } = hiiqReward as unknown as HiiqReward
        const result = await userIsInitialized(address)
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
