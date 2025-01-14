import config from '@/config'
import { NextApiResponse } from 'next'

export const setCacheHeaders = (
  res: NextApiResponse,
  cacheHeader = `public, s-maxage=${config.CACHE_DURATION_SECONDS}, stale-while-revalidate=${config.CACHE_STALE_WHILE_REVALIDATE_SECONDS}`,
): void => {
  const headers = [
    ['Cache-Control', cacheHeader],
    ['CDN-Cache-Control', cacheHeader],
    ['Vercel-CDN-Cache-Control', cacheHeader],
  ] as const
  headers.forEach(([name, value]) => res.setHeader(name, value))
}
