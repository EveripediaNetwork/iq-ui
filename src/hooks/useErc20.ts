import config from '@/config'
import { formatContractResult } from '@/utils/LockOverviewUtils'
import { useAccount, useBalance } from 'wagmi'

export const useErc20 = () => {
  const { address } = useAccount()

  const { data: erc20Balance } = useBalance({
    address: address,
    token: config.iqAddress as `0x${string}`,
  })

  const { data: totalValueLocked } = useBalance({
    address: config.hiiqAddress as `0x${string}`,
    token: config.iqAddress as `0x${string}`,
  })

  const getUserBalance = () => {
    return erc20Balance?.value ?? BigInt(0)
  }

  const tvl = () => {
    if (totalValueLocked) {
      const result = formatContractResult(totalValueLocked.toString())
      return result
    }
    return 0
  }

  return {
    userTokenBalance: getUserBalance(),
    tvl: tvl(),
  }
}
