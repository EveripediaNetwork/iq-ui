import hiIQABI from '@/abis/hiIQABI.abi'
import {
  YEARS_LOCK,
  calculateUserPoolRewardOverTheYear,
  EP_COINGECKO_URL,
  IQ_TOKEN_HOLDER,
  ETHERSCAN_TOKEN_TRANSACTION_API,
} from '@/data/LockConstants'
import * as Humanize from 'humanize-plus'
import { parseEther, formatEther, fromHex } from 'viem'
import { decodeEventLog } from 'viem'

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

export const getDollarValue = async () => {
  try {
    const a = await fetch(EP_COINGECKO_URL)
    const price = (await a.json()).everipedia.usd
    const result = (await price) as number
    return result
  } catch (_err) {
    return 0
  }
}

export const getNumberOfHiIQHolders = async () => {
  try {
    const TOP_HOLDER_COUNT = 7
    const response = await fetch(IQ_TOKEN_HOLDER)
    const data = await response.json()
    const totalHoldersCount =
      data.pager?.holders?.total ?? data.token?.holdersCount ?? 0
    const topHoldersData = data.holders.slice(0, TOP_HOLDER_COUNT)
    const remainingHoldersData = data.holders.slice(TOP_HOLDER_COUNT)
    let aggregateShare = 0
    let remainingBalance = 0
    for (const holder of remainingHoldersData) {
      aggregateShare += holder.share
      remainingBalance += holder.balance
    }
    topHoldersData.push({
      balance: remainingBalance,
      share: aggregateShare,
      address: 'Others',
    })
    return {
      holdersCount: totalHoldersCount,
      holdersData: topHoldersData,
    }
  } catch (_err) {
    return { holdersCount: 0, holdersData: [] }
  }
}

export const getHiIQTransactions = async () => {
  try {
    const result = await fetch(ETHERSCAN_TOKEN_TRANSACTION_API)
    const data = await result.json()
    const decodedData = data.result.map((item: any) => {
      const value = decodeEventLog({
        abi: hiIQABI,
        data: item.data,
        topics: item.topics,
      })
      return {
        address: item.address,
        timeStamp: fromHex(item.timeStamp, 'number'),
        value,
      }
    })
    const filteredData = decodedData.filter(
      (item: any) => item.value.eventName === 'Deposit',
    )
    const totalLocktime = filteredData.reduce(
      (acc: any, item: any) =>
        acc + (Number(item.value.args.locktime) - Number(item.timeStamp)),
      0,
    )
    const averageLocktime = Number(totalLocktime) / filteredData.length
    const averageLocktimeDays = averageLocktime / 86400
    return averageLocktime ? averageLocktimeDays / 365 : 0
  } catch (_err) {
    console.log(_err, '_err')
    return 0
  }
}

export const addGasLimitBuffer = (value: bigint) =>
  (value * BigInt(10000 + 2500)) / BigInt(10000)

export const formatValue = (value: number) => {
  if (value !== undefined) {
    const valueToString = value.toString()
    return valueToString.length > 6
      ? Humanize.compactInteger(value, 1)
      : Humanize.formatNumber(value, 1)
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

export const getValueFromBigInt = (value: number | bigint) => {
  if (value && typeof value !== 'number') {
    const result = formatEther(value)
    return parseFloat(result)
  }
  return 0
}

export const convertStringValueToBigInt = (value: string) => {
  return parseEther(`${Number(value)}`)
}

export const getUserLockEndDate = (lockEndDate: string) => {
  if (lockEndDate) {
    if (Number(lockEndDate) > 0) {
      const convertedDate = Number(lockEndDate) * 1000
      const date = new Date(convertedDate)
      return date
    }
  }
  return undefined
}
