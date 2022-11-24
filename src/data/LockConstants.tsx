export const YEARS_LOCK = 4
export const YIELD_GAS_LIMIT = 185000
export const CHECKPOINT_GAS_LIMIT = 220000
export const LOCK_UPDATE_GAS_LIMIT = 440000
export const LOCK_AND_WITHDRAWAL_GAS_LIMIT = 390000
export const DEFAULT_GAS_LIMIT = 170000
export const EP_COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=everipedia&vs_currencies=usd'
export const IQ_TOKEN_HOLDER =
  'https://ethplorer.io/service/service.php?data=0x1bf5457ecaa14ff63cc89efd560e251e814e16ba&page=pageSize%3D600%26pageTab%3Dholders%26tab%3Dtab-holders&showTx=all'
export const NORMALIZE_VALUE = 10e17


const REWARDS_FOR_THE_FIRST_YEAR = 1095000000
const REWARDS_FOR_THE_SECOND_YEAR = 547500000
const REWARDS_FOR_THE_THIRD_YEAR = 273750000
const REWARDS_FOR_THE_FOURTH_YEAR = 136875000
const REWARDS_FOR_THE_FIFTH_YEAR = 68437500

const rewards = {
  1: REWARDS_FOR_THE_SECOND_YEAR,
  2: REWARDS_FOR_THE_THIRD_YEAR,
  3: REWARDS_FOR_THE_FOURTH_YEAR,
  4: REWARDS_FOR_THE_FIFTH_YEAR,
}

export const TOTAL_REWARDS_ACROSS_LOCK_PERIOD = (): number => {
  const newModelStartDate = new Date('November 1, 2022')
  const diffInMiliseconds = Date.now() - newModelStartDate.getTime()
  const yearsOfDifference = Math.abs(new Date(diffInMiliseconds).getUTCFullYear() - 1970)

  if (yearsOfDifference === 0)
    return REWARDS_FOR_THE_FIRST_YEAR

  return Object.values(rewards)[yearsOfDifference - 1]
}
