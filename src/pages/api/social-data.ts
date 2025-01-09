import { setCacheHeaders } from '@/utils/cache'
import { NextApiRequest, NextApiResponse } from 'next/types'

const CACHE_DURATION_SECONDS = 12 * 60 * 60 // 12 hours

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
    const redditResponse = await fetch(
      'https://www.reddit.com/r/everipedia/about.json',
    )
    const twitterResponse = await fetch(
      'https://twitter-api45.p.rapidapi.com/followers.php?screenname=IQWIKI',
      {
        headers: {
          'x-rapidapi-key':
            '141412b455mshd09467584258910p14bf05jsn949a29def245',
          'x-rapidapi-host': 'twitter-api45.p.rapidapi.com',
          'cache-control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${
            2 * CACHE_DURATION_SECONDS
          }`,
        },
      },
    )
    const { followers_count: twitterFollowers } = await twitterResponse.json()
    const redditData = await redditResponse.json()
    const data = {
      social: {
        twitter: twitterFollowers,
        reddit: redditData.data.subscribers,
      },
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
