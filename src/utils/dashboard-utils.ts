import { chain } from '@/data/treasury-data'
import axios from 'axios'

export const numFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
}).format

export const fetchPrices = async () => {
  const graphDays = [1, 7, 30, 365]
  const urls = graphDays.map(
    d =>
      `https://api.coingecko.com/api/v3/coins/everipedia/market_chart?vs_currency=usd&days=${d}`,
  )

  const priceData = urls.map(async url => {
    const preFetchData = await fetch(url)
    return preFetchData.json()
  })

  const response = await Promise.all(priceData)
  return response
}

export const fetchPriceChange = async () => {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/everipedia')
  return res.json()
}

export const ethGasPrice = async () => {
  try {
    const result = await axios.get('/api/gas-price', {
      params: { chain: chain.Eth },
    })
    return result.data.response
  } catch (err) {
    console.log(err)
  }
  return undefined
}

export const sanitizePrices = (prices: number[][]) => {
  return prices.map(priceArr => {
    return {
      name: priceArr[0],
      amt: priceArr[1],
    }
  })
}

export const shortenBalance = (balance: number | null) =>
  typeof balance === 'number' ? balance.toFixed(2) : balance

export const compareValues = (
  firstValue: number,
  secondValue: number,
  placement: 'HIGHEST' | 'LOWEST',
) => {
  if (placement === 'HIGHEST') {
    return firstValue > secondValue ? firstValue : secondValue
  }
  return firstValue < secondValue ? firstValue : secondValue
}
