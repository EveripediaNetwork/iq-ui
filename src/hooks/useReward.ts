import config from '@/config'
import { hiIQRewardABI } from '@/config/abis'
import {
  addGasLimitBuffer,
  formatContractResult,
  getDollarValue,
} from '@/utils/LockOverviewUtils'
import { Signer } from 'ethers'
import { ContractInterface } from '@ethersproject/contracts'
import { useAccount, useContractRead, useContract, useSigner } from 'wagmi'

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
      gasLimit: addGasLimitBuffer(await hiiqReward.estimateGas.checkpoint()),
    })
    return result
  }

  return {
    totalRewardEarned,
    isFetchingTotalReward,
    rewardEarned: () => getTotalRewardEarned(),
    checkPoint: () => checkPoint()
  }
}
