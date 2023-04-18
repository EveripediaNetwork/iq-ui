import { useEffect, useState, useRef } from 'react'
import { provider } from '@/utils/getProvider'
import { Dict } from '@chakra-ui/utils'
import { formatUnits } from 'viem'
import { TokenDetailsType } from '@/components/wallet/types'
import config from '@/config'
import { useContract } from 'wagmi'

const abi = [
  'function balanceOf(address addr) view returns (uint256)',
  'function locked(address addr) view returns (int128 amount, uint256 end)',
]

export const getIqTokenValue = async () =>
  fetch(
    'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=everipedia',
  )
    .then(response => response.json())
    .then(data => {
      return +data.everipedia.usd
    })

export const getTokenValue = (
  arrayOfTokenDetails: TokenDetailsType[],
  name: string | undefined,
) => {
  if (arrayOfTokenDetails) {
    const res = arrayOfTokenDetails.find(details => details?.token === name)
    if (res) {
      return res.price
    }
  }
  return 0
}

const HIIQ_CONTRACT_ADDRESS = config.hiiqAddress
const hiiqContract = useContract({
  addressOrName: HIIQ_CONTRACT_ADDRESS,
  contractInterface: abi,
  signerOrProvider: provider,
})

export const useHiIQBalance = (address: string | undefined | null) => {
  const [hiiqDetails, updateHiIQDetails] = useState<Dict | null>(null)
  const isFetched = useRef(false)

  useEffect(() => {
    const getBalance = async () => {
      const hiiqBalance = await hiiqContract
        .balanceOf(address)
        .then((r: bigint) => Number(formatUnits(r, 18)))
      const lockInfo = await hiiqContract
        .locked(address)
        .then(([amount, end]: [bigint, bigint]) => ({
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
