import config from '@/config'

const TESTNET_GAS_LIMIT = 20_000_000
export const YEARS_LOCK = 4
export const YIELD_GAS_LIMIT = config.isProd ? 185_000 : TESTNET_GAS_LIMIT
export const CHECKPOINT_GAS_LIMIT = config.isProd ? 220_000 : TESTNET_GAS_LIMIT
export const LOCK_UPDATE_GAS_LIMIT = config.isProd ? 440000 : TESTNET_GAS_LIMIT
export const LOCK_AND_WITHDRAWAL_GAS_LIMIT = config.isProd
  ? 490000
  : TESTNET_GAS_LIMIT
export const DEFAULT_GAS_LIMIT = config.isProd ? 170000 : TESTNET_GAS_LIMIT
export const APPROVE = config.isProd ? 50000 : TESTNET_GAS_LIMIT
export const CLAIM_WARNING_THRESHOLD = 1000
export const EP_COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=everipedia&vs_currencies=usd'
export const EP_COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/simple'
export const IQ_TOKEN_HOLDER = `https://api.ethplorer.io/getTopTokenHolders/0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba?apiKey=${config.ethplorerApiKey}&limit=100`
export const ETHERSCAN_TOKEN_TRANSACTION_API = `https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${config.hiiqAddress}&apikey=${config.etherScanApiKey}`
export const NORMALIZE_VALUE = 10e17
const REWARDS_FOR_THE_FIRST_YEAR = 547500000 // 1.5M per day for 365 days

export const getTotalIQMintedPerYear = (year = 0): number => {
  const newModelStartDate = new Date('November 1, 2023')
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
  const EMMITED_IQ_PER_DAY = 1_500_000
  return EMMITED_IQ_PER_DAY * 7
}
