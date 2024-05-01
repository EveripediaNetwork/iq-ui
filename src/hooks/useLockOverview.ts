/* eslint-disable indent */
import hiIQABI from '@/abis/hiIQABI.abi'
import config from '@/config'
import { getPublicClient } from '@wagmi/core'
import { formatEther } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { wagmiConfig } from '@/config/wagmi'

const readContract = {
  address: config.hiiqAddress as `0x${string}`,
  abi: hiIQABI,
}

export const useLockOverview = (userAddress?: string) => {
  const { address } = useAccount()
  const provider = getPublicClient(wagmiConfig)
  const {
    data: totalHiiq,
    isError: totalSupplyError,
    isLoading: isFetchingTotalSupply,
  } = useReadContract({
    ...readContract,
    functionName: 'totalSupply',
  })

  const { data: hiiQBalance } = useReadContract({
    ...readContract,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const { data: userLockendDate, refetch: refetchUserLockEndDate } =
    useReadContract({
      ...readContract,
      functionName: 'locked__end',
      args: [address as `0x${string}`],
    })

  const {
    data: totalLockedIq,
    isError: totalLockedIqError,
    isLoading: isFetchingTotalLockIq,
    refetch: refetchTotalLockedIQ,
  } = useReadContract({
    ...readContract,
    functionName: 'locked',
    args: [(userAddress || address) as `0x${string}`],
  })

  const getTotalHiiqSupply = () => {
    if (totalHiiq) {
      return Number(formatEther(totalHiiq))
    }
    return 0
  }

  const getUserTotalIQLocked = () => {
    if (totalLockedIq) {
      const amount = totalLockedIq[0]
      return Number(formatEther(amount))
    }
    return 0
  }

  const getUserHiiqBalance = () => {
    if (hiiQBalance) {
      return Number(formatEther(hiiQBalance))
    }
    return 0
  }

  const getMaximumLockablePeriod = async (lockEnd: Date) => {
    const block = await provider.getBlock() //since latest is the default
    const max = new Date((Number(block.timestamp) + 4 * 365 * 86400) * 1000) // return type of getBlock is a bigint
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
