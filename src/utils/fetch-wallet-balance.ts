import { tokenDetails } from '../components/wallet/wallet-data'
import {
  BalanceType,
  ParamsType,
  ErrorType,
  TokenDetailsType,
  ConvertedBalanceType,
  WalletBalanceType,
} from '../components/wallet/types'
import { store } from '@/store/store'
import { getTokenRate } from '@/services/tokenRate'

export const fetchTokenRate = async (
  tokenName: string,
  versusCurrency = 'usd',
) => {
  const { data } = await store.dispatch(
    getTokenRate.initiate({
      tokenName,
      versusCurrency,
    }),
  )
  if (data) {
    return data[tokenName].usd
  }
  return 0
}

export const fetchWalletBalance = async (
  getBalance: (config?: ParamsType) => Promise<BalanceType | ErrorType>,
  arrayOfAddresses: ParamsType[],
) => {
  const results: Promise<BalanceType | ErrorType>[] = []
  arrayOfAddresses.forEach(addr => {
    results.push(getBalance(addr))
  })
  const response = await Promise.all(results)
  const convertedResult: ConvertedBalanceType[] = response.map(res => ({
    data: {
      formatted: res.data?.formatted,
      symbol: res.data?.symbol,
    },
    error: res.error,
  }))
  return convertedResult
}

export const fetchRateAndCalculateTotalBalance = async (
  walletDetails: WalletBalanceType[],
) => {
  const prices = walletDetails.map(async wallet => {
    try {
      const tokenName: string | undefined =
        wallet.data?.symbol && tokenDetails[wallet.data?.symbol].name
      if (tokenName) {
        const rate = await fetchTokenRate(tokenName)
        return {
          price: rate * Number(wallet.data?.formatted),
          token: wallet.data?.symbol,
        }
      }
    } catch (_err) {
      return null
    }
    return null
  })
  return Promise.all(prices)
}

export const calculateTotalBalance = (
  arrayOfTokenDetails: TokenDetailsType[],
) => {
  let total = 0
  arrayOfTokenDetails.forEach(details => {
    if (details) {
      total += details.price
    }
  })
  return total
}
