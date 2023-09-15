import { getWalletClient } from '@wagmi/core'
import { tokenOptionData } from '@/data/TokenOptionData'


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
