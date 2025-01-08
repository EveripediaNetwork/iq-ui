import config from '@/config'
import { NextApiResponse } from 'next'

export const setCacheHeaders = (
  res: NextApiResponse,
  cacheHeader = `public, s-maxage=${config.CACHE_DURATION_SECONDS}, stale-while-revalidate=${config.CACHE_STALE_WHILE_REVALIDATE_SECONDS}`,
) => {
  res.setHeader('Cache-Control', cacheHeader)
  res.setHeader('CDN-Cache-Control', cacheHeader)
  res.setHeader('Vercel-CDN-Cache-Control', cacheHeader)
}
