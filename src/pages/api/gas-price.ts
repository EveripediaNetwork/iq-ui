import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'

const NORMALIZE_VALUE = 10e8
type ResponseData = {
  status: boolean
  message: string
  response?: number
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const url = 'https://pro-openapi.debank.com/v1/wallet/gas_market?chain_id=eth'
  const result = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Accesskey: `${config.debankApiKey}`,
    },
  })
  const response = await result.json()
  const gasPrice = response[1]?.price / NORMALIZE_VALUE
  res.setHeader('Cache-Control', 's-maxage=60')
  return res.status(200).json({
    response: gasPrice,
    status: true,
    message: 'gas price successfully fetched',
  })
}
