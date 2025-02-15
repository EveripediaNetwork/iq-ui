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
    const { chainId, id } = req.query
    if (!chainId || !id) {
      return res.status(400).json({
        status: false,
        message: 'chain id and wallet address are needed',
      })
    }
    const url = `https://pro-openapi.debank.com/v1/user/chain_balance?chain_id=${chainId}&id=${id}`
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
      message: 'Balance details successfully fetched',
    })
  } catch (error) {
    console.error('Fetch balance details error:', error)

    return res.status(500).json({
      status: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch protocol details',
    })
  }
}
