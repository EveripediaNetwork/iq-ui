import { getWalletClient } from '@wagmi/core'
import { tokenOptionData } from '@/data/TokenOptionData'
import { wagmiConfig } from '@/config/wagmi'

export const addToken = async (token: 'IQ' | 'HiIQ') => {
  const walletClient = await getWalletClient(wagmiConfig)
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
