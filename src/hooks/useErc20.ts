import IQABI from '@/abis/IQABI.abi'
import config from '@/config'
import { formatEther } from 'viem'
import { useAccount, useReadContract, useBalance } from 'wagmi'

export const useErc20 = () => {
  const { address } = useAccount()
  const { data: erc20Balance, refetch: refetchErc20Balance } = useBalance({
    address: address as `0x${string}`,
  })

  const { data: totalValueLocked } = useReadContract({
    address: config.iqAddress as `0x${string}`,
    abi: IQABI,
    functionName: 'balanceOf',
    args: [config.hiiqAddress as `0x${string}`],
  })

  const getUserBalance = () => {
    if (address) {
      refetchErc20Balance()
    }
    return erc20Balance?.value ?? BigInt(0)
  }
  const tvl = () => {
    if (totalValueLocked) {
      const result = formatEther(totalValueLocked)
      return +result
    }
    return 0
  }

  return {
    userTokenBalance: getUserBalance(),
    tvl: tvl(),
  }
}
