/* eslint-disable indent */
import config from '@/config'
import { hiIQABI } from '@/config/abis'
import { GAS_LIMIT } from '@/data/LockConstants'
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
    functionName: 'balanceOf',
    args: [address],
    overrides: { gasLimit: GAS_LIMIT },
  })

  const { data: lockEndDate } = useContractRead({
    ...readContract,
    functionName: 'locked__end',
    args: [address],
    overrides: { gasLimit: GAS_LIMIT },
  })

  const {
    data: totalLockedIq,
    isError: totalLockedIqError,
    isLoading: isFetchingTotalLockIq,
  } = useContractRead({
    ...readContract,
    functionName: 'locked',
    args: [address],
    overrides: { gasLimit: GAS_LIMIT },
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
      return formatContractResult(hiiQBalance.amount)
    }
    return 0
  }

  const getUserLockEndDate = () => {
    if (lockEndDate) {
      const result = formatContractResult(lockEndDate)
      if (result > 0) {
        const convertedDate = Number(lockEndDate.toString()) * 1000
        const date = new Date(convertedDate)
        return date
      }
      return 0
    }
    return 0
  }

  const getMaximumLocablePeriod = async (lockEnd: Date) => {
    const block = await provider.getBlock('latest')
    const max = new Date((block.timestamp + 4 * 365 * 86400) * 1000)
    max.setHours(0)
    max.setMinutes(0)
    max.setSeconds(0)
    const diffTime = Math.abs(+max - +lockEnd)
    console.log(diffTime)
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
    lockEndDate: getUserLockEndDate(),
    getMaximumLocablePeriod: (lockEnd: Date) =>
      getMaximumLocablePeriod(lockEnd),
  }
}
