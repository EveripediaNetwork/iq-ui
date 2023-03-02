import { MAX_USER_WEIGHT } from '@/data/GaugesConstants'
import { WEEKS } from '@/types/gauge'

export const getUnusedWeight = (weight: number) => {
  const usedWeight = (weight * 100) / MAX_USER_WEIGHT
  const unusedRaw = 100 - usedWeight

  return { used: `${usedWeight}%`, unused: `${unusedRaw}%`, unusedRaw }
}

export const checkDateIsBetweenDateRange = (date: string, type: WEEKS) => {
  const convertedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastThursday = new Date()
  lastThursday.setDate(today.getDate() - ((today.getDay() + 3) % 7))
  lastThursday.setHours(0, 0, 0, 0)
  if (type === WEEKS.LAST_WEEK) {
    const thursdayOfLastLastWeek = new Date(lastThursday)
    thursdayOfLastLastWeek.setDate(thursdayOfLastLastWeek.getDate() - 7)
    return (
      convertedDate >= thursdayOfLastLastWeek && convertedDate <= lastThursday
    )
  }
  convertedDate.setHours(0, 0, 0, 0)
  return convertedDate >= lastThursday && convertedDate <= today
}

export const getEpochTime = (lockEnd: string) => {
  const dateTime = new Date(lockEnd)
  const timestamp = dateTime.getTime() / 1000
  return timestamp
}

export const calculateMaxStakePeriod = (startDate: string, endDate: string) => {
  const newStartDate = new Date(startDate)
  const newEndDate = new Date(endDate)
  const timeDiff = Math.abs(newEndDate.getTime() - newStartDate.getTime())
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return daysDiff
}
