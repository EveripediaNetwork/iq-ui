import config from '@/config'
import { setCacheHeaders } from '@/utils/cache'
import { NextApiRequest, NextApiResponse } from 'next/types'

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
    const url =
      'https://twitter-api45.p.rapidapi.com/followers.php?screenname=IQWIKI'
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': `${config.twitterRapidApiKey}`,
        'x-rapidapi-host': 'twitter-api45.p.rapidapi.com',
      },
    }

    const redditResponse = await fetch(
      'https://www.reddit.com/r/everipedia/about.json',
      {
        headers: {
          'User-Agent': 'IQ-UI/1.0',
        },
      },
    ).then((res) => {
      if (!res.ok) throw new Error('Reddit API failed')
      return res.json()
    })
    const twitterResponse = await fetch(url, options).then((res) => {
      if (!res.ok) throw new Error('Twitter API failed')
      return res.json()
    })

    const { followers_count: twitterFollowers } = await twitterResponse.json()
    const redditData = await redditResponse.json()
    const data = {
      twitterFollowers,
      redditFollowers: redditData.data.subscribers,
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
