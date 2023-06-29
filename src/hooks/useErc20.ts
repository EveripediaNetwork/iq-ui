import config from '@/config'
import { erc20 } from '@/config/abis'
import { formatContractResult } from '@/utils/LockOverviewUtils'
import { useAccount, useBalance, useContractRead } from 'wagmi'

const readContract = {
  addressOrName: config.iqAddress,
  contractInterface: erc20,
}

export const useErc20 = () => {
  const { address } = useAccount()

  const { data: erc20Balance } = useBalance({
    address: address,
    token: config.iqAddress,
  })

  const { data: totalValueLocked } = useContractRead({
    ...readContract,
    functionName: 'balanceOf(address)',
    args: [config.hiiqAddress],
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

useErc20
