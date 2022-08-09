import {
  YEARS_LOCK,
  TOTAL_REWARDS_ACROSS_LOCK_PERIOD,
} from '@/data/LockConstants'

export const calculate4YearsYield = (totalHiiq: number) => {
  let yieldWithA4YearLock = 1 * (1 + 0.75 * 4)

  yieldWithA4YearLock /= totalHiiq + yieldWithA4YearLock

  yieldWithA4YearLock *= TOTAL_REWARDS_ACROSS_LOCK_PERIOD * 4
  yieldWithA4YearLock = (yieldWithA4YearLock / 1) * 100

  return yieldWithA4YearLock
}

export const calculateAPR = (totalHiiq: number, totalLockedIq: number) => {
  const amountLocked = totalLockedIq > 0 ? totalLockedIq : 1000000
  const rewardsBasedOnLockPeriod = amountLocked * (1 + 0.75 * YEARS_LOCK)
  const poolRatio =
    rewardsBasedOnLockPeriod / (totalHiiq + rewardsBasedOnLockPeriod)
  const userRewards = TOTAL_REWARDS_ACROSS_LOCK_PERIOD * YEARS_LOCK * poolRatio
  const aprAcrossLockPeriod = (userRewards / amountLocked) * 100
  return aprAcrossLockPeriod
}
