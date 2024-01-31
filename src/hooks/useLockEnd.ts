import { useCallback } from 'react'
import { useLockOverview } from './useLockOverview'
import { getUserLockEndDate } from '@/utils/LockOverviewUtils'

export const useLockEnd = () => {
  const { userLockendDate, refetchUserLockEndDate } = useLockOverview()

  const lockEndDate =
    userLockendDate !== undefined
      ? getUserLockEndDate(userLockendDate.toString())
      : undefined

  const memoizedRefetch = useCallback(() => {
    refetchUserLockEndDate()
  }, [userLockendDate, refetchUserLockEndDate])

  return { lockEndDate, refetchUserLockEndDate: memoizedRefetch } as const
}
