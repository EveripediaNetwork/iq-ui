import { RAFFLE_DATA } from '@/data/RaffleData'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  const raffle = RAFFLE_DATA.find(r => r.slug === slug)
  res.status(200).json(raffle)
}
