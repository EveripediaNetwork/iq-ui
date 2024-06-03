import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '@/types/TreasuryTokenType'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { ids, chain } = req.query
  if (!ids || !chain) {
    return res.status(400).json({
      status: false,
      message: 'List of Token address and chain id are needed',
    })
  }
  const url = `https://pro-openapi.debank.com/v1/token/list_by_ids?chain_id=${chain}&ids=${ids}`
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
    message: 'list of token information successfully fetched',
  })
}
