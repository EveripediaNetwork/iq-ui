import config from "@/config"

export const YEARS_LOCK = 4
export const YIELD_GAS_LIMIT = 185000
export const CHECKPOINT_GAS_LIMIT = 220000
export const LOCK_UPDATE_GAS_LIMIT = 440000
export const LOCK_AND_WITHDRAWAL_GAS_LIMIT = 490000
export const DEFAULT_GAS_LIMIT = 170000
export const APPROVE = 50000
export const EP_COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=everipedia&vs_currencies=usd'
export const IQ_TOKEN_HOLDER =
  'https://ethplorer.io/service/service.php?data=0x1bf5457ecaa14ff63cc89efd560e251e814e16ba&page=pageSize%3D600%26pageTab%3Dholders%26tab%3Dtab-holders&showTx=all'
export const ETHERSCAN_TOKEN_TRANSACTION_API = `https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${config.hiiqAddress}&apikey=${config.etherScanApiKey}`
export const NORMALIZE_VALUE = 10e17
const REWARDS_FOR_THE_FIRST_YEAR = 1095000000 // 3M per day for 365 days

export const getTotalIQMintedPerYear = (year = 0): number => {
  const newModelStartDate = new Date('November 1, 2022')
  const currentDate = new Date()
  currentDate.setFullYear(currentDate.getFullYear() + year)
  const diffInMiliseconds = currentDate.getTime() - newModelStartDate.getTime()
  const yearsOfDifference = Math.abs(
    new Date(diffInMiliseconds).getUTCFullYear() - 1970,
  )
  if (yearsOfDifference === 0) return REWARDS_FOR_THE_FIRST_YEAR
  return REWARDS_FOR_THE_FIRST_YEAR / 2 ** yearsOfDifference // halving model suggests that every year, the reward halfs its initial amount... i.e (1/ 2^n) where n is the number of yrs
}

export const calculateUserPoolRewardOverTheYear = (
  years: number,
  userTotalHiiq: number,
  totalHIIQ: number,
) => {
  let totalPoolReward = 0
  for (let i = 0; i < years; i += 1) {
    const totalIQMintedEachYear = getTotalIQMintedPerYear(i)
    const userPoolRationForTheYear =
      (userTotalHiiq / (totalHIIQ + userTotalHiiq)) * totalIQMintedEachYear
    totalPoolReward += userPoolRationForTheYear
  }
  return totalPoolReward
}

export const calculateEstimatedYieldPerWeek = () => {
  const EMMITED_IQ_PER_DAY = 3_000_000
  return EMMITED_IQ_PER_DAY * 7
}
