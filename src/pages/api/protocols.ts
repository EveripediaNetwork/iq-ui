import config from '@/config'
import { ResponseData } from '@/types/TreasuryTokenType'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { protocolId, id } = req.query
  if (!protocolId || !id) {
    res.setHeader('Cache-Control', `s-maxage=${config.CACHE_DURATION_SECONDS}`)
    return res.status(400).json({
      status: false,
      message: 'protocol id and wallet address are needed',
    })
  }
  const url = `https://pro-openapi.debank.com/v1/user/protocol?protocol_id=${protocolId}&id=${id}&is_all=true`
  const result = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Accesskey: `${config.debankApiKey}`,
    },
  })
  res.setHeader('Cache-Control', `s-maxage=${config.CACHE_DURATION_SECONDS}`)
  return res.status(200).json({
    response: await result.json(),
    status: true,
    message: 'protocol details successfully fetched',
  })
}
