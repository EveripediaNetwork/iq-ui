import { setCacheHeaders } from '@/utils/cache'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { sendTwitterApiRequest } from '@everipedia/iq-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    // const redditResponse = await fetch(
    //   'https://www.reddit.com/r/everipedia/about.json',
    // )
    const twitterResponse = await sendTwitterApiRequest(
      'https://api.twitter.com/2/users/IQWIKI/followers',
      'GET',
    )
    console.log({ twitterResponse })
    const { followers_count: twitterFollowers } = await twitterResponse.json()
    // const redditData = await redditResponse.json()
    const data = {
      twitterFollowers,
    }

    setCacheHeaders(res)
    res.status(200).json(data)
  } catch (error) {
    console.error('Fetch social data error:', error)
    res.status(500).json({
      status: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch social data',
    })
  }
}
