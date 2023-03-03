import {
  YEARS_LOCK,
  calculateUserPoolRewardOverTheYear,
  EP_COINGECKO_URL,
  IQ_TOKEN_HOLDER,
} from '@/data/LockConstants'
import { Result } from '@ethersproject/abi'
import { BigNumber, ethers } from 'ethers'
import * as Humanize from 'humanize-plus'

export const calculateStakeReward = (
  totalHiiq: number,
  amountLocked: number,
  years: number,
  poolRewardCalculationYear: number,
) => {
  const yearsLocked = years || YEARS_LOCK
  const rewardsBasedOnLockPeriod =
    amountLocked + amountLocked * 3 * (yearsLocked / 4)
  const totalPoolRewardForTheLockYear = calculateUserPoolRewardOverTheYear(
    poolRewardCalculationYear,
    rewardsBasedOnLockPeriod,
    totalHiiq,
  )
  return totalPoolRewardForTheLockYear
}

export const calculateAPR = (
  totalHiiq: number,
  totalLockedIq: number,
  years: number,
) => {
  const amountLocked = totalLockedIq > 0 ? totalLockedIq : 1000000
  const stakeReward = calculateStakeReward(totalHiiq, amountLocked, years, 1)
  const aprAcrossLockPeriod = stakeReward / amountLocked
  const aprDividedByLockPeriod = aprAcrossLockPeriod * 100
  return aprDividedByLockPeriod
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
  lockEndDate: undefined | Date,
  iqToBeLocked: number,
) => {
  let tokenToBeLocked = userTotalIQLocked
  let timeLocked = lockValue
  if (iqToBeLocked) {
    tokenToBeLocked += iqToBeLocked
  }
  if (lockEndDate) {
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

export const getUserLockEndDate = (lockEndDate: Result|undefined) => {
  if (lockEndDate) {
    const result = formatContractResult(lockEndDate)
    if (result > 0) {
      const convertedDate = Number(lockEndDate.toString()) * 1000
      const date = new Date(convertedDate)
      return date
    }
  }
  return undefined
}
