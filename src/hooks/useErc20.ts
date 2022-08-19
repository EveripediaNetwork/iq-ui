import config from '@/config'
import { erc20 } from '@/config/abis'
import { formatContractResult } from '@/utils/LockOverviewUtils'
import { ContractInterface } from '@ethersproject/contracts'
import { useAccount, useContractRead } from 'wagmi'

const readContract = {
  addressOrName: config.iqAddress,
  contractInterface: erc20 as ContractInterface,
}

export const useErc20 = () => {
  const { address } = useAccount()
  const { data: erc20Balance } = useContractRead({
    ...readContract,
    functionName: 'balanceOf',
    args: [address],
  })

  const getUserBalance = () => {
    if (erc20Balance) {
      const result = formatContractResult(erc20Balance)
      return result
    }
    return 0
  }

  return {
    userTokenBalance: getUserBalance(),
  }
}
