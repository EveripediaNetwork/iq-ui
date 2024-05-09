import config from '@/config'
import { useAccount, useBalance } from 'wagmi'

export const useErc20 = () => {
  const { address } = useAccount()
  const { data: erc20Balance, refetch: refetchErc20Balance } =
    config.alchemyChain === 'iqChain'
      ? useBalance({
          address: address,
          token: config.wiqAddress as `0x${string}`,
        })
      : useBalance({
          address: address,
          token: config.iqAddress as `0x${string}`,
        })

  const { data: totalValueLocked } =
    config.alchemyChain === 'iqChain'
      ? useBalance({
          address: config.hiiqAddress as `0x${string}`,
          token: config.wiqAddress as `0x${string}`,
        })
      : useBalance({
          address: config.hiiqAddress as `0x${string}`,
          token: config.iqAddress as `0x${string}`,
        })

  const getUserBalance = () => {
    if (address) {
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
