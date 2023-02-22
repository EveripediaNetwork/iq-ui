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

  const lastThursday = new Date()
  lastThursday.setDate(today.getDate() - ((today.getDay() + 3) % 7))

  if (type === WEEKS.LAST_WEEK) {
    const thursdayOfLastLastWeek = new Date(lastThursday)
    thursdayOfLastLastWeek.setDate(thursdayOfLastLastWeek.getDate() - 7)
    return (
      convertedDate >= thursdayOfLastLastWeek && convertedDate <= lastThursday
    )
  }
  return convertedDate >= lastThursday && convertedDate <= today
}

export const getEpochTime = (lockEnd: string) => {
  const dateTime = new Date(lockEnd)
  const timestamp = dateTime.getTime() / 1000
  return timestamp
}
