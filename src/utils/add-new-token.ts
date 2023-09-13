import { getWalletClient } from '@wagmi/core'
import config from '@/config'

type tokenOptions = {
  address: string
  decimals: number
  symbol: string
  image: string
}

const tokenOptionData: { [key: string]: tokenOptions } = {
  IQ: {
    address: config.iqAddress,
    decimals: 18,
    symbol: 'IQ',
    image:
      'https://assets.coingecko.com/coins/images/5010/small/YAIS3fUh.png?1626267646',
  },
  HiIQ: {
    address: config.hiiqAddress,
    decimals: 18,
    symbol: 'HiIQ',
    //TODO add hiiq logo
    image: '',
  },
}

export const addToken = async (token: 'IQ' | 'HiIQ') => {
  const walletClient = await getWalletClient()
  if (!walletClient) {
    throw new Error('No wallet found!')
  }
  try {
    const success = await walletClient?.watchAsset({
      type: 'ERC20',
      options: tokenOptionData[token],
    })
    console.log('token added: ', success)
  } catch (error) {
    console.log(error)
  }
}
