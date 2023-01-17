import { ptokenAlchemy } from '@/config/alchemy-sdk'
import { useEffect, useState } from 'react'
import { fetchContractBalances } from './alchemyUtils'

export type PtokenData = {
  contractAddress: string
  tokenBalance: string
}

export const getPtokenBalance = async () => {
  const balance = await fetchContractBalances(
    ptokenAlchemy,
    '0x30953aebf5e3f2c139e9e19bf246dd3a575ddaf7',
    ['0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea'],
  )

  return balance.tokenBalances[0]
}

export const usePTokensBalance = () => {
  const [data, setData] = useState<PtokenData>()

  useEffect(() => {
    const run = async () => {
      const tokenBalance = (await getPtokenBalance()) as PtokenData

      setData(tokenBalance)
    }

    run()
  }, [])

  return data?.tokenBalance
}
