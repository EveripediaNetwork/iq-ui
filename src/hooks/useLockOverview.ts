/* eslint-disable indent */
import config from '@/config'
import { hiIQABI } from '@/config/abis'
import { ContractInterface } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { useAccount, useContractRead } from 'wagmi'

const readContract = {
  addressOrName: config.hiiqAddress,
  contractInterface: hiIQABI as ContractInterface,
}

export const useLockOverview = () => {
  const { address } = useAccount()

  const {
    data: totalHiiq,
    isError: totalSupplyError,
    isLoading: isFetchingTotalSupply,
  } = useContractRead({
    ...readContract,
    functionName: 'totalSupply()',
  })

  const {
    data: totalLockedIq,
    isError: totalLockedIqError,
    isLoading: isFetchingTotalLockIq,
  } = useContractRead({
    ...readContract,
    functionName: 'locked',
    args: [address],
  })

  const getTotalHiiqSupply = () => {
    if (totalHiiq) {
      const totalHiiqSupply = ethers.utils.formatEther(
        totalHiiq,
      ) as unknown as number
      return totalHiiqSupply
    }
    return 0
  }

  const getUserTotalIQLocked = () => {
    if (totalLockedIq) {
      const totalLocked = ethers.utils.formatEther(
        totalLockedIq,
      ) as unknown as number
      return totalLocked
    }
    return 0
  }

  return {
    totalHiiq,
    totalLockedIq,
    totalSupplyError,
    totalLockedIqError,
    isFetchingTotalLockIq,
    isFetchingTotalSupply,
    totalHiiqSupply: getTotalHiiqSupply(),
    userTotalIQLocked: getUserTotalIQLocked(),
  }
}
