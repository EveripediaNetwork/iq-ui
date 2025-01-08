import config from '@/config'
import { setCacheHeaders } from '@/utils/cache'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  status: boolean
  message?: string
  data?: number
  error?: string
}

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
    const response = await fetch(
      'https://api-v1.mymerlin.io/api/merlin/public/balances/chain/0x9f4360a2390321cb1cbff4cebeb4315d64ed3ac1?chain=matic',
      {
        headers: {
          Authorization: config.merlinApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response body:', errorText)

      throw new Error(
        `API error: ${response.status} - ${response.statusText}. Details: ${errorText}`,
      )
    }

    const data = await response.json()

    if (!data || typeof data.valueUsd === 'undefined') {
      throw new Error('Invalid response format: missing valueUsd')
    }

    setCacheHeaders(res)
    return res.status(200).json({
      status: true,
      data: data.valueUsd,
    })
  } catch (error) {
    console.error('Balance fetch error:', error)

    return res.status(500).json({
      status: false,
      error: 'Failed to fetch balance',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
