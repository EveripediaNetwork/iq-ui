import {
  useAccount,
  useBalance,
  useContract,
  useContractWrite,
  useSigner,
} from 'wagmi'
import { erc20Abi } from '@/abis/erc20.abi'
import { minterAbi } from '@/abis/minter.abi'
import { ptokenAbi } from '@/abis/ptoken.abi'
import config from '@/config'
import { getError } from '@/utils/getError'
import { usePTokensBalance } from '@/utils/fetch-ptoken-balance'
import { calculateGasBuffer } from '@/utils/LockOverviewUtils'
import { APPROVE } from '@/data/LockConstants'
import { formatEther, parseEther } from 'viem'


export const useBridge = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const maxUint256 = BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  )

  const { data, refetch } = usePTokensBalance()

  const { writeAsync: mint } = useContractWrite({
    addressOrName: config.pMinterAddress,
    contractInterface: minterAbi,
    functionName: 'mint',
  })

  const { writeAsync: burn } = useContractWrite({
    addressOrName: config.pMinterAddress,
    contractInterface: minterAbi,
    functionName: 'burn',
  })

  const { writeAsync: redeem } = useContractWrite({
    addressOrName: config.pIqAddress,
    contractInterface: ptokenAbi,
    functionName: 'redeem',
  })

  const { data: pTokenBalance, refetch: refetchPTokenBalance } = useBalance({
    addressOrName: address,
    token: config.pIqAddress,
  })

  const { data: iqBalance } = useBalance({
    addressOrName: address,
    token: config.iqAddress,
  })

  const iqErc20Contract = useContract({
    addressOrName: config.iqAddress,
    contractInterface: erc20Abi,
    signerOrProvider: signer,
  })

  const pIqErc20Contract = useContract({
    addressOrName: config.pIqAddress,
    contractInterface: erc20Abi,
    signerOrProvider: signer,
  })

  const needsApproval = async (amount: bigint, spender: string, erc20: any) => {
    const allowedTokens = await erc20.allowance(address, spender)
    if (allowedTokens.lt(amount)) {
      const approvedResult = await erc20.approve(spender, maxUint256, {
        gasLimit: calculateGasBuffer(APPROVE),
      })
      await approvedResult.wait()
    }
  }

  const getPIQBalance = () => {
    if (pTokenBalance) return formatEther(pTokenBalance.value.toBigInt())
    return '0'
  }

  const getIQBalanceOnEth = () => {
    if (iqBalance) return formatEther(iqBalance.value.toBigInt())
    return '0'
  }

  const bridgeFromEthToEos = async (amount: string, eosAccount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)

    try {
      await needsApproval(amountParsed, config.pMinterAddress, iqErc20Contract)

      const { wait: waitForTheBurn } = await burn({ args: [amountParsed] })
      await waitForTheBurn()

      const { wait: waitForRedeem } = await redeem({
        args: [amountParsed, eosAccount],
        overrides: { gasLimit: 1e5 },
      })
      await waitForRedeem()
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)

    try {
      await needsApproval(amountParsed, config.pMinterAddress, pIqErc20Contract)

      const { wait: waitForMint } = await mint({
        args: [amountParsed],
        overrides: { gasLimit: 150e3 },
      })
      await waitForMint(3)
      refetchPTokenBalance()
      refetch()
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  return {
    pIQTokenBalance: data,
    pIQBalance: getPIQBalance(),
    iqBalanceOnEth: getIQBalanceOnEth(),
    bridgeFromEthToEos: (amount: string, eosAccount: string) =>
      bridgeFromEthToEos(amount, eosAccount),
    bridgeFromPTokenToEth: (amount: string) => bridgeFromPTokenToEth(amount),
  }
}
