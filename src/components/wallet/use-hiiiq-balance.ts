import { useEffect, useState } from 'react'
import { provider } from '@/utils/getProvider'
import { BaseContract, Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { Dict } from '@chakra-ui/utils'
import { TokenDetailsType } from '@/components/wallet/types'

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

const HIIQ_CONTRACT_ADDRESS = '0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba'
const hiiqContract = new Contract(
  HIIQ_CONTRACT_ADDRESS,
  abi,
  provider as unknown as BaseContract['provider'],
)

export const useHiIQBalance = (address: string | undefined | null) => {
  const [hiiqDetails, updateHiIQDetails] = useState<Dict | null>(null)
  useEffect(() => {
    const getBalance = async () => {
      const hiiqBalance = await hiiqContract
        .balanceOf(address)
        .then((r: BigNumber) => Number(formatUnits(r, 18)))
      const lockInfo = await hiiqContract
        .locked(address)
        .then(([amount, end]: [BigNumber, BigNumber]) => ({
          iqLocked: Number(formatUnits(amount, 18)),
          end: new Date(end.toNumber() * 1000),
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
    }
    if (address?.length) {
      getBalance()
    }
  }, [address])

  return { hiiq: hiiqDetails }
}
