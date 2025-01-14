import config from '@/config'
import { setCacheHeaders } from '@/utils/cache'
import type { NextApiRequest, NextApiResponse } from 'next'

const NORMALIZE_VALUE = 10e8
type ResponseData = {
  status: boolean
  message: string
  response?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ status: false, message: 'Method not allowed' })
  }
  try {
    const url =
      'https://pro-openapi.debank.com/v1/wallet/gas_market?chain_id=eth'
    const result = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Accesskey: `${config.debankApiKey}`,
      },
    })
    const response = await result.json()
    const gasPrice = response[1]?.price / NORMALIZE_VALUE
    setCacheHeaders(res)
    return res.status(200).json({
      response: gasPrice,
      status: true,
      message: 'gas price successfully fetched',
    })
  } catch (error) {
    console.error('gas price fetch error:', error)

    return res.status(500).json({
      status: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch gas price',
    })
  }
}
