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
  const res = await fetch(
    `https://api.owlracle.info/v3/eth/gas?apikey=2c2e6cc356284185ac4bc4dadc7e9252`,
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

export const shortenBalance = (balance: number | null) =>
  typeof balance === 'number' ? balance.toFixed(2) : balance
