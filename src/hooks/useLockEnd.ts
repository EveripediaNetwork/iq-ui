import { getUserLockEndDate } from '@/utils/LockOverviewUtils'
import { useEffect, useState } from 'react'
import { useLockOverview } from './useLockOverview'

export const useLockEnd = () => {
  const [lockEndDate, setLockEndDate] = useState<Date>()
  const { userLockendDate, refetchUserLockEndDate } = useLockOverview()
  useEffect(() => {
    setLockEndDate(
      userLockendDate !== undefined
        ? getUserLockEndDate(userLockendDate.toString())
        : undefined,
    )
  }, [userLockendDate])

  return { lockEndDate, refetchUserLockEndDate } as const
}
