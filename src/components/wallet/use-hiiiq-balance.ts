import { useEffect, useState, useRef } from 'react'
import { Dict } from '@chakra-ui/utils'
import { formatUnits } from 'viem'
import { TokenDetailsType } from '@/components/wallet/types'
import config from '@/config'
import { useContractRead } from 'wagmi'
import hiIQABI from '@/abis/hiIQABI.abi'
import { useGetIqPriceQuery } from '@/services/iqPrice'

export const getIqTokenValue = async () => {
  return fetch(
    'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=everipedia',
    {
      mode: 'no-cors',
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return +data.everipedia.usd
    })
}

export const getTokenValue = (
  arrayOfTokenDetails: TokenDetailsType[],
  name: string | undefined,
) => {
  if (arrayOfTokenDetails) {
    const res = arrayOfTokenDetails.find((details) => details?.token === name)
    if (res) {
      return res.price
    }
  }
  return 0
}

const contractConfig = {
  address: config.hiiqAddress as `0x${string}`,
  abi: hiIQABI,
}

export const useHiIQBalance = (address: string | undefined | null) => {
  const [hiiqDetails, updateHiIQDetails] = useState<Dict | null>(null)
  const isFetched = useRef(false)

  const { data: balanceOf } = useContractRead({
    ...contractConfig,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const { data: locked } = useContractRead({
    ...contractConfig,
    functionName: 'locked',
    args: [address as `0x${string}`],
  })
  const { data } = useGetIqPriceQuery('IQ')

  useEffect(() => {
    const getBalance = async () => {
      const fetchedBalance = balanceOf
        ? BigInt(balanceOf?.toString())
        : BigInt(0)
      const hiiqBalance = Number(formatUnits(fetchedBalance, 18))
      if (!locked) return
      const lockInfo = {
        iqLocked: Number(formatUnits(locked[0], 18)),
        end: new Date(Number(locked[1]) * 1000),
      }
      const coinGeckoIqPrice = data?.response
        ? +data?.response?.[0]?.quote?.USD?.price
        : 0
      updateHiIQDetails({
        hiiqBalance,
        iqBalance: lockInfo.iqLocked,
        lockEndDate: lockInfo.end,
        symbol: 'HiIQ',
        iqPrice: coinGeckoIqPrice,
        totalUsdBalance: coinGeckoIqPrice * lockInfo.iqLocked,
      })
      isFetched.current = true
    }
    if (address?.length && !isFetched.current && data) {
      getBalance()
    }
  }, [address, data])

  return { hiiq: hiiqDetails }
}
