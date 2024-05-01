import config from '@/config'
import { formatUnits } from 'viem'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/config/wagmi'

export const getTokenBalance = async (
  token: 'IQ' | 'hiIQ',
  address: `0x${string}`,
) => {
  let balance = 0n
  switch (token) {
    case 'IQ':
      balance = (
        await getBalance(wagmiConfig, {
          address: address,
          token: config.iqAddress as `0x${string}`,
        })
      )?.value
      break
    case 'hiIQ':
      balance = (
        await getBalance(wagmiConfig, {
          address: address,
          token: config.hiiqAddress as `0x${string}`,
        })
      )?.value
      break
  }
  const balDataFormatted = balance ? BigInt(balance?.toString()) : BigInt(0)
  const tokenBalance = Number(formatUnits(balDataFormatted, 18))
  return tokenBalance
}
