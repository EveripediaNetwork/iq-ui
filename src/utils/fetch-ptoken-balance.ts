import { ethAlchemy } from '@/config/alchemy-sdk'
import { useEffect, useState } from 'react'
import { fetchContractBalances } from './alchemyUtils'
import { formatContractResult } from './LockOverviewUtils'

export type PtokenData = {
  contractAddress: string
  tokenBalance: string
}

const PTOKEN_TOKEN_ADDRESS = ['0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea']
const PTOKEN_CONTRACT_ADDRESS = '0x30953aebf5e3f2c139e9e19bf246dd3a575ddaf7'

export const getPtokenBalance = async () => {
  const balance = await fetchContractBalances(
    ethAlchemy,
    PTOKEN_CONTRACT_ADDRESS,
    PTOKEN_TOKEN_ADDRESS,
  )

  return balance.tokenBalances[0]
}

export const usePTokensBalance = () => {
  const [data, setData] = useState<PtokenData>()

  const fetchPTOkenBalance = async () => {
    const tokenBalance = (await getPtokenBalance()) as PtokenData
    setData(tokenBalance)
  }

  useEffect(() => {
    fetchPTOkenBalance()
  }, [])

  return {
    data: data ? formatContractResult(data?.tokenBalance as string) : 0,
    refetch: () => fetchPTOkenBalance(),
  }
}
