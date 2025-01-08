import config from '@/config'
import { NextApiResponse } from 'next'

const cacheHeader = `public, s-maxage=${config.CACHE_DURATION_SECONDS}, stale-while-revalidate=${config.CACHE_STALE_WHILE_REVALIDATE_SECONDS}`

export const setCacheHeaders = (res: NextApiResponse) => {
  res.setHeader('Cache-Control', cacheHeader)
  res.setHeader('CDN-Cache-Control', cacheHeader)
  res.setHeader('Vercel-CDN-Cache-Control', cacheHeader)
}
