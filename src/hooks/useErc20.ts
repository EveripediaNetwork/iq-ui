import config from '@/config'
import { useAccount, useBalance } from 'wagmi'

export const useErc20 = () => {
  const { address } = useAccount()

  const shouldFetchBalance = !!address

  const { data: erc20Balance, refetch: refetchErc20Balance } = useBalance({
    address: address,
    token: config.iqAddress as `0x${string}`,
    enabled: shouldFetchBalance,
  })

  const { data: totalValueLocked } = useBalance({
    address: config.hiiqAddress as `0x${string}`,
    token: config.iqAddress as `0x${string}`,
    enabled: shouldFetchBalance,
  })

  const getUserBalance = () => {
    if (shouldFetchBalance) {
      refetchErc20Balance()
    }
    return erc20Balance?.value ?? BigInt(0)
  }

  const tvl = () => {
    if (totalValueLocked) {
      const result = Number(totalValueLocked.formatted)
      return result
    }
    return 0
  }

  return {
    userTokenBalance: getUserBalance(),
    tvl: tvl(),
  }
}
