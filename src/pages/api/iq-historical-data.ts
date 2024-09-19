import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { days } = req.query

  if (!days) {
    return res.status(400).json({ error: 'Days parameter is required' })
  }

  try {
    const url = `https://pro-api.coingecko.com/api/v3/coins/everipedia/market_chart?vs_currency=usd&days=${days}`
    const response = await fetch(url, {
      headers: {
        'x-cg-pro-api-key': process.env.COINGECKO_API_KEY as string,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error)
    res.status(500).json({ error: 'Failed to fetch data from CoinGecko' })
  }
}
