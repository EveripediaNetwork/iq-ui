import config from '@/config'
import { ResponseData } from '@/types/TreasuryTokenType'
import { setCacheHeaders } from '@/utils/cache'
import type { NextApiRequest, NextApiResponse } from 'next'

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
    const { protocolId, id } = req.query
    if (!protocolId || !id) {
      setCacheHeaders(res)
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
    setCacheHeaders(res)
    return res.status(200).json({
      response: await result.json(),
      status: true,
      message: 'protocol details successfully fetched',
    })
  } catch (error) {
    console.error('Fetch protocol details error:', error)

    return res.status(500).json({
      status: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch protocol details',
    })
  }
}
