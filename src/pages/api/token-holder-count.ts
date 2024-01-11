import config from '@/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type ResponseData = {
  status: boolean
  message: string
  response?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const { address } = req.query
    const response = await axios.get(
      `https://api.ethplorer.io/getTokenInfo/${address}?apiKey=${config.ethplorerApiKey}`,
    )
    const holderCount = response.data?.holdersCount
    res.setHeader('Cache-Control', 's-maxage=120')
    return res.status(200).json({
      response: holderCount,
      status: true,
      message: 'Data successfully fetched',
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      response: null,
      status: false,
      message: 'Something went wrong',
    })
  }
}
