import {
  YEARS_LOCK,
  TOTAL_REWARDS_ACROSS_LOCK_PERIOD,
  EP_COINGECKO_URL,
} from '@/data/LockConstants'
import { Result } from '@ethersproject/abi'
import { BigNumber, ethers } from 'ethers'

export const calculate4YearsYield = (totalHiiq: number) => {
  let yieldWithA4YearLock = 1 * (1 + 0.75 * 4)
  yieldWithA4YearLock /= totalHiiq + yieldWithA4YearLock
  yieldWithA4YearLock *= TOTAL_REWARDS_ACROSS_LOCK_PERIOD * 4
  yieldWithA4YearLock = (yieldWithA4YearLock / 1) * 100
  return yieldWithA4YearLock
}

export const calculateUserReward = (
  totalHiiq: number,
  years: number | null,
  amountLocked: number,
) => {
  const yearsLocked = years || YEARS_LOCK
  const rewardsBasedOnLockPeriod = amountLocked * (1 + 0.75 * yearsLocked)
  const poolRatio =
    rewardsBasedOnLockPeriod / (totalHiiq + rewardsBasedOnLockPeriod)
  return TOTAL_REWARDS_ACROSS_LOCK_PERIOD * yearsLocked * poolRatio
}

export const calculateAPR = (
  totalHiiq: number,
  totalLockedIq: number,
  years: number | null,
) => {
  const amountLocked = totalLockedIq > 0 ? totalLockedIq : 1000000
  const userRewards = calculateUserReward(totalHiiq, years, amountLocked)
  const aprAcrossLockPeriod = (userRewards / amountLocked) * 100
  return aprAcrossLockPeriod
}

export const formatContractResult = (value: Result) => {
  return ethers.utils.formatEther(value) as unknown as number
}

export const getDollarValue = async () => {
  try {
    const a = await fetch(EP_COINGECKO_URL)
    const price = (await a.json()).everipedia.usd
    return price
  } catch (err) {
    return 0
  }
}

export const addGasLimitBuffer = (value: BigNumber) =>
  value
    .mul(ethers.BigNumber.from(10000 + 2500))
    .div(ethers.BigNumber.from(10000))
