import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '@/types/TreasuryTokenType'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { walletAddress } = req.query
  if (!walletAddress) {
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
  res.setHeader('Cache-Control', 's-maxage=43200')
  return res.status(200).json({
    response: await result.json(),
    status: true,
    message: 'token details successfully fetched',
  })
}
