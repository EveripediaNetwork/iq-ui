import { getUserLockEndDate } from '@/utils/LockOverviewUtils'
import { useEffect, useState } from 'react'
import { useLockOverview } from './useLockOverview'

export const useLockEnd = () => {
  const [lockEndDate, setLockEndDate] = useState<Date>()
  const { userLockendDate } = useLockOverview()
  useEffect(() => {
    const value = getUserLockEndDate((userLockendDate as bigint)?.toString() ?? '')
    setLockEndDate(value)
  }, [userLockendDate])

  return { lockEndDate } as const
}
