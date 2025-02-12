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
  //get native balance
  const { data: coinData, refetch: refetchCoinData } = useBalance({
    address: addressOrName as `0x${string}`,
  })
  //get erc20 balance
  const { data: erc20Balance, refetch: refetchErc20Balance } = useBalance({
    address: addressOrName as `0x${string}`,
    token: config.erc20IQConfig.address,
  })

  const isFeteched = useRef(false)

  const refreshBalance = async () => {
    const newIqData = refetchCoinData()
    const newErc20Data = refetchErc20Balance()
    const response = await Promise.all([newIqData, newErc20Data])
    const convertedResult: WalletBalanceType[] = response.map((res) => ({
      data: {
        formatted: res.data?.formatted,
        symbol: res.data?.symbol,
      },
    }))
    return convertedResult
  }

  useEffect(() => {
    if (coinData && erc20Balance && !isFeteched.current) {
      const convertedIqData = {
        data: {
          formatted: coinData?.formatted,
          symbol: coinData?.symbol,
        },
      }
      const convertedErc20Data = {
        data: {
          formatted: erc20Balance?.formatted,
          symbol: erc20Balance?.symbol,
        },
      }
      const result = [convertedIqData, convertedErc20Data]

      setUserBalance(result)
      isFeteched.current = true
    }
  }, [coinData, erc20Balance])

  return { userBalance, refreshBalance } as const
}
