import {
  YEARS_LOCK,
  TOTAL_REWARDS_ACROSS_LOCK_PERIOD,
  EP_COINGECKO_URL,
  IQ_TOKEN_HOLDER,
} from '@/data/LockConstants'
import { Result } from '@ethersproject/abi'
import { BigNumber, ethers } from 'ethers'
import * as Humanize from 'humanize-plus'

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

export const formatContractResult = (value: Result | string) => {
  const result = ethers.utils.formatEther(value) as unknown as string
  return parseFloat(result)
}

export const getDollarValue = async () => {
  try {
    const a = await fetch(EP_COINGECKO_URL)
    const price = (await a.json()).everipedia.usd
    const result = (await price) as number
    return result
  } catch (err) {
    return 0
  }
}

export const getNumberOfHiIQHolders = async () => {
  try {
    const response = await fetch(IQ_TOKEN_HOLDER)
    const data = await response.json()
    return data.pager?.holders?.total || data.token?.holdersCount || 0
  } catch (err) {
    return 0
  }
}

export const addGasLimitBuffer = (value: BigNumber) =>
  value
    .mul(ethers.BigNumber.from(10000 + 2500))
    .div(ethers.BigNumber.from(10000))

export const formatValue = (value: number) => {
  if (value !== undefined) {
    const valueToString = value.toString()
    return valueToString.length > 6
      ? Humanize.compactInteger(value, 2)
      : Humanize.formatNumber(value, 2)
  }
  return 0
}

export const calculateReturn = (
  userTotalIQLocked: number,
  lockValue: number,
  lockEndDate: number | Date,
  iqToBeLocked: number,
) => {
  let tokenToBeLocked = userTotalIQLocked
  let timeLocked = lockValue
  if (iqToBeLocked) {
    tokenToBeLocked += iqToBeLocked
  }
  if (typeof lockEndDate !== 'number') {
    const currentDateTime = new Date().getTime()
    const lockedTime = lockEndDate.getTime()
    const differenceInDays = (lockedTime - currentDateTime) / (1000 * 3600 * 24)
    if (differenceInDays > 0) timeLocked += differenceInDays
  }
  const returns = tokenToBeLocked + (tokenToBeLocked * 3 * timeLocked) / 1460
  return returns
}

export const calculateGasBuffer = (gasFee: number) => {
  return gasFee + gasFee * 0.1
}

export const getValueFromBigNumber = (value: number | BigNumber) => {
  if (value && typeof value !== 'number') {
    const result = ethers.utils.formatEther(value) as unknown as string
    return parseFloat(result)
  }
  return 0
}

export const convertStringValueToBigNumber = (value: string) => {
  return ethers.utils.parseEther(value)
}
