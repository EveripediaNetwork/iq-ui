import { chain } from '@/data/treasury-data'
import axios from 'axios'

export const numFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
}).format

export const fetchPrices = async () => {
  const graphDays = [1, 7, 30, 365]
  const urls = graphDays.map(
    (d) =>
      `https://api.coingecko.com/api/v3/coins/everipedia/market_chart?vs_currency=usd&days=${d}`,
  )

  const priceData = urls.map(async (url) => {
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
  return prices.map((priceArr) => {
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

export const getDateRange = (value: string) => {
  const startDate = new Date()
  const endDate = new Date()
  if(value === 'All'){
    return {
      startDate: 0,
      endDate: Math.floor(endDate.getTime() / 1000),
    }
  }

  if (value === '30days') {
    startDate.setDate(startDate.getDate() - 30)
  } else if (value === '90days') {
    startDate.setDate(startDate.getDate() - 90)
  } else if (value === '365days') {
    startDate.setDate(startDate.getDate() - 365)
  } 

  endDate.setHours(23, 59, 59, 999)
  return {
    startDate: Math.floor(startDate.getTime() / 1000),
    endDate: Math.floor(endDate.getTime() / 1000),
  }
}
