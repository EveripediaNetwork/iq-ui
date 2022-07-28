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

export const fetchCoinMarket = async () => {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=everipedia&order=market_cap_desc&per_page=100&page=1&sparkline=false',
  )

  return res.json()
}

export const sanitizePrices = (prices: number[][]) => {
  return prices.map(priceArr => {
    return {
      name: priceArr[0],
      amt: priceArr[1],
    }
  })
}
