import { useEffect, useState, useRef } from 'react'
import { useBalance } from 'wagmi'
import config from '@/config'

type WalletBalanceType = {
  data?: {
    formatted: string | undefined
    symbol: string | undefined
  }
}

export const useFetchWalletBalance = (addressOrName: string | undefined) => {
  const [userBalance, setUserBalance] = useState<WalletBalanceType[]>()
  const { data: iqData, refetch: refetchIqData } = useBalance({
    address: addressOrName as `0x${string}`,
    //fetch native bal on testnet
    token: config.isProd ? (config.iqAddress as `0x${string}`) : undefined,
  })

  const isFeteched = useRef(false)

  const refreshBalance = async () => {
    const newIqData = refetchIqData()
    const response = await Promise.all([newIqData])
    const convertedResult: WalletBalanceType[] = response.map((res) => ({
      data: {
        formatted: res.data?.formatted,
        symbol: res.data?.symbol,
      },
    }))
    return convertedResult
  }

  useEffect(() => {
    if (iqData && !isFeteched.current) {
      const convertedIqData = {
        data: {
          formatted: iqData?.formatted,
          symbol: iqData?.symbol,
        },
      }
      const result = [convertedIqData]
      setUserBalance(result)
      isFeteched.current = true
    }
  }, [iqData])

  return { userBalance, refreshBalance } as const
}
