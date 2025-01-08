import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '@/types/TreasuryTokenType'
import { setCacheHeaders } from '@/utils/cache'

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
    const { walletAddress } = req.query
    if (!walletAddress) {
      setCacheHeaders(res)
      return res
        .status(400)
        .json({ status: false, message: 'Wallet address are needed' })
    }
    const url = `https://pro-openapi.debank.com/v1/user/all_token_list?id=${walletAddress}&is_all=true`
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
      message: 'token details successfully fetched',
    })
  } catch (error) {
    console.error('Fetch token error:', error)

    return res.status(500).json({
      status: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch token details',
    })
  }
}
