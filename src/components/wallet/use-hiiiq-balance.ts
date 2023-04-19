import { useEffect, useState, useRef } from 'react'
import { client } from '@/utils/getProvider'
import { Dict } from '@chakra-ui/utils'
import { formatUnits } from 'viem'
import { TokenDetailsType } from '@/components/wallet/types'
import config from '@/config'
import { Abi } from 'abitype'

const abi = [
  'function balanceOf(address addr) view returns (uint256)',
  'function locked(address addr) view returns (int128 amount, uint256 end)',
]

export const getIqTokenValue = async () =>
  fetch(
    'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=everipedia',
  )
    .then((response) => response.json())
    .then((data) => {
      return +data.everipedia.usd
    })

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

const HIIQ_CONTRACT_ADDRESS = config.hiiqAddress

const contractConfig = {
  abi: abi as unknown as Abi,
  address: HIIQ_CONTRACT_ADDRESS as `0x${string}`,
}

export const useHiIQBalance = async (address: string | undefined | null) => {
  const [hiiqDetails, updateHiIQDetails] = useState<Dict | null>(null)
  const isFetched = useRef(false)

  const hiiqBal = await client.readContract({
    ...contractConfig,
    functionName: 'balanceOf',
    args: [address],
  })

  const lockedHiiqBal = await client.readContract({
    ...contractConfig,
    functionName: 'locked',
    args: [address],
  })
  useEffect(() => {
    const getBalance = async () => {
      const hiiqBalance = Number(formatUnits(hiiqBal as unknown as bigint, 18))
      const lockBalance = lockedHiiqBal as unknown as any
      const lockInfo = lockBalance.then(([amount, end]: [bigint, bigint]) => ({
        iqLocked: Number(formatUnits(amount, 18)),
        end: new Date(Number(end) * 1000),
      }))

      const coinGeckoIqPrice = await getIqTokenValue()

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
    if (address?.length && !isFetched.current) {
      getBalance()
    }
  }, [address])

  return { hiiq: hiiqDetails }
}
