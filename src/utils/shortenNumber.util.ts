import * as short from 'short-number'

export const shortenNumber = (num: number) => {
  if (num > 1e19) return `${String(num).substring(0, 9)}...`
  return short(num)
}
