import config from '@/config'
import type { NextApiResponse } from 'next'
import { ResponseData } from '@/types/TreasuryTokenType'

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
    res.setHeader('Cache-Control', 's-maxage=43200')
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
