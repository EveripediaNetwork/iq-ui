import type { NextApiResponse } from 'next'

type ResponseData = {
    response?: number
    status: boolean
    message: string
  }

export default async function handler(
    res: NextApiResponse<ResponseData>,
) {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=everipedia&vs_currencies=usd'
    try{

        const result = await fetch(url)
        const response = await result.json()
        const price = response?.everipedia?.usd
        res.setHeader('Cache-Control', 's-maxage=60')
        return res.status(200).json({
            response: price,
            status: true,
            message: 'iq price successfully fetched',
        })
    } catch (error) {
        console.error('Error fetching data:', error)
        return res.status(500).json({
            status: false,
            message: 'Error fetching iq price',
        })
    }
}