import config from '@/config'
import type { NextApiResponse } from 'next'
import { ResponseData } from '@/types/TreasuryTokenType'
import { setCacheHeaders } from './cache'

export async function fetchDataFromAPI(
  url: string,
  res: NextApiResponse<ResponseData>,
): Promise<void> {
  try {
    const result = await fetch(url, {
      headers: {
        accept: 'application/json',
        accesskey: `${config.debankApiKey}`,
      },
    })
    const responseData = await result.json()
    setCacheHeaders(res)
    res.status(200).json({
      response: responseData,
      status: true,
      message: 'Data successfully fetched',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: false,
      message: 'Failed to fetch data',
    })
  }
}
