/* eslint-disable indent */
import config from '@/config'
import { hiIQABI } from '@/config/abis'
import { DEFAULT_GAS_LIMIT } from '@/data/LockConstants'
import { formatContractResult } from '@/utils/LockOverviewUtils'
import { ContractInterface } from '@ethersproject/contracts'
import { useAccount, useContractRead, useProvider } from 'wagmi'

const readContract = {
  addressOrName: config.hiiqAddress,
  contractInterface: hiIQABI as ContractInterface,
}

export const useLockOverview = () => {
  const { address } = useAccount()
  const provider = useProvider()

  const {
    data: totalHiiq,
    isError: totalSupplyError,
    isLoading: isFetchingTotalSupply,
  } = useContractRead({
    ...readContract,
    functionName: 'totalSupply()',
  })

  const { data: hiiQBalance } = useContractRead({
    ...readContract,
    functionName: 'balanceOf(address)',
    args: [address],
    overrides: { gasLimit: DEFAULT_GAS_LIMIT },
  })

  const { data: userLockendDate, refetch: refetchUserLockEndDate } =
    useContractRead({
      ...readContract,
      functionName: 'locked__end',
      args: [address],
      overrides: { gasLimit: DEFAULT_GAS_LIMIT },
    })

  const {
    data: totalLockedIq,
    isError: totalLockedIqError,
    isLoading: isFetchingTotalLockIq,
    refetch: refetchTotalLockedIQ,
  } = useContractRead({
    ...readContract,
    functionName: 'locked',
    args: [address],
    overrides: { gasLimit: DEFAULT_GAS_LIMIT },
  })

  const getTotalHiiqSupply = () => {
    if (totalHiiq) {
      return formatContractResult(totalHiiq)
    }
    return 0
  }

  const getUserTotalIQLocked = () => {
    if (totalLockedIq) {
      return formatContractResult(totalLockedIq.amount)
    }
    return 0
  }

  const getUserHiiqBalance = () => {
    if (hiiQBalance) {
      return formatContractResult(hiiQBalance)
    }
    return 0
  }

  const getMaximumLockablePeriod = async (lockEnd: Date) => {
    const block = await provider.getBlock('latest')
    const max = new Date((block.timestamp + 4 * 365 * 86400) * 1000)
    max.setHours(0)
    max.setMinutes(0)
    max.setSeconds(0)
    const diffTime = Math.abs(+max - +lockEnd)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays - 1
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
    hiiqBalance: getUserHiiqBalance(),
    userLockendDate,
    getMaximumLockablePeriod: (lockEnd: Date) =>
      getMaximumLockablePeriod(lockEnd),
    refreshTotalIQLocked: () => refetchTotalLockedIQ(),
    refetchUserLockEndDate: () => refetchUserLockEndDate(),
  }
}

