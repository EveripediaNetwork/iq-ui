export const BRAINIES_MAX_SUPPLY = 3333
export const WEIGHT_VOTE_DELAY = 10 * 86400
export const MAX_USER_WEIGHT = 1e4 // RAW VALUE
export const MAX_MINT_AMOUNT = 2

export const LAST_WEEK_BLOCK_TIMESTAMPS = (timeTotal: number) => {
  const startBlockTimestamp = new Date(timeTotal * 1000)
  startBlockTimestamp.setSeconds(startBlockTimestamp.getSeconds() - 604800 * 2)

  const endBlockTimestamp = new Date()
  startBlockTimestamp.setSeconds(endBlockTimestamp.getSeconds() - 604800)

  return {
    startBlockTimestamp: Math.round(startBlockTimestamp.getTime() / 1000),
    endBlockTimestamp: Math.round(endBlockTimestamp.getTime() / 1000),
  }
}

export const THIS_WEEK_BLOCK_TIMESTAMPS = (timeTotal: number) => {
  const startBlockTimestamp = new Date(timeTotal * 1000)
  startBlockTimestamp.setSeconds(startBlockTimestamp.getSeconds() - 604800)

  return {
    startBlockTimestamp: Math.round(startBlockTimestamp.getTime() / 1000),
    endBlockTimestamp: Date.now() / 1000,
  }
}
