import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '@/types/TreasuryTokenType'
import { fetchDataFromAPI } from '@/utils/fetchData.utils'
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
  const { ids, chain } = req.query
  if (!ids || !chain) {
    setCacheHeaders(res)
    return res.status(400).json({
      status: false,
      message: 'List of Token address and chain id are needed',
    })
  }

  const url = `https://pro-openapi.debank.com/v1/token/list_by_ids?chain_id=${chain}&ids=${ids}`
  await fetchDataFromAPI(url, res)
}
