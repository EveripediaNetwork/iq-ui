import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  status: boolean
  message: string
  response?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { protocolId, tokenId } = req.query
  if (!protocolId || !tokenId) {
    return res
      .status(400)
      .json({ status: false, message: 'chain id and token id are required' })
  }

  const url = `https://pro-openapi.debank.com/v1/user/protocol?id=${tokenId}&protocol_id=${protocolId}`
  const result = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Accesskey: `${config.debankApiKey}`,
    },
  })

  const response = await result.json()
  res.setHeader('Cache-Control', 's-maxage=60')
  return res.status(200).json({
    response,
    status: true,
    message: 'successfully fetched',
  })
}
