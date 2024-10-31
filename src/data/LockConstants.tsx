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

// New emission constants
export const DAILY_EMISSION = 3_000_000 // 3M IQ per day
export const YEARLY_EMISSION = DAILY_EMISSION * 365
export const WEEKLY_EMISSION = DAILY_EMISSION * 7

export const calculateEstimatedYieldPerWeek = () => {
  return WEEKLY_EMISSION
}
