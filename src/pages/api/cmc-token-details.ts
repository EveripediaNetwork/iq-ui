import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { setCacheHeaders } from '@/utils/cache'

const CACHE_DURATION_SECONDS = 300

export type ResponseData = {
  status: boolean
  message: string
  response?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const { tokenName } = req.query
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokenName}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': config.cmcApiKey as string,
        },
      },
    )
    setCacheHeaders(
      res,
      `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${
        2 * CACHE_DURATION_SECONDS
      }`,
    )
    return res.status(200).json({
      response: response.data,
      status: true,
      message: 'token details successfully fetched',
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return res.status(500).json({
      status: false,
      message: 'Error fetching token details',
    })
  }
}
