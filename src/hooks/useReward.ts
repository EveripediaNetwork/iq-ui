import config from '@/config'
import { hiIQRewardABI } from '@/config/abis'
import { formatContractResult, getDollarValue } from '@/utils/LockOverviewUtils'
import { Signer } from 'ethers'
import { ContractInterface } from '@ethersproject/contracts'
import { useAccount, useContractRead, useContract, useSigner } from 'wagmi'
import { GAS_LIMIT } from '@/data/LockConstants'

const readContract = {
  addressOrName: config.hiiqRewardAddress,
  contractInterface: hiIQRewardABI as ContractInterface,
}

export const useReward = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const hiiqReward = useContract({
    ...readContract,
    signerOrProvider: signer as Signer,
  })

  const { data: totalRewardEarned, isLoading: isFetchingTotalReward } =
    useContractRead({
      ...readContract,
      functionName: 'earned',
      args: [address],
      watch: true,
    })

  const getTotalRewardEarned = async () => {
    if (totalRewardEarned) {
      const result = formatContractResult(totalRewardEarned)
      if (result > 0) {
        const rate = await getDollarValue()
        return rate * result
      }
    }
    return 0
  }

  const checkPoint = async () => {
    const result = await hiiqReward.checkpoint({
      gasLimit: GAS_LIMIT,
    })
    return result
  }

  const getYield = async () => {
    const result = await hiiqReward.getYield({
      gasLimit: GAS_LIMIT,
    })
    return result
  }

  const checkIfUserIsInitialized = async () => {
    if(address){
      try{
        const result = await hiiqReward.userIsInitialized(address)
        return result
      }
      catch(err){
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
  }
}
