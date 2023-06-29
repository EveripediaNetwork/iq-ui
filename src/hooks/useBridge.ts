import {
  useAccount,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
  useWalletClient,
} from 'wagmi'
import { waitForTransaction } from 'wagmi/actions'
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
  const { data: signer } = useWalletClient()
  const maxUint256 = BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  )

  const { data, refetch } = usePTokensBalance()

  const { data: mint } = useContractWrite({
    address: config.pMinterAddress,
    abi: minterAbi,
    functionName: 'mint',
  })

  const { data: burn } = useContractWrite({
    addressOrName: config.pMinterAddress,
    abi: minterAbi,
    functionName: 'burn',
  })

  const { data: redeem } = useContractWrite({
    addressOrName: config.pIqAddress,
    abi: ptokenAbi,
    functionName: 'redeem',
  })

  const { data: pTokenBalance, refetch: refetchPTokenBalance } = useBalance({
    address: address,
    token: config.pIqAddress,
  })

  const { data: iqBalance } = useBalance({
    address: address,
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
    const { data: allowedTokens } = useContractRead({
      address: config.iqAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, spender],
    })
    if (allowedTokens.lt(amount)) {
      const approvedResult = await erc20.approve(spender, maxUint256, {
        gasLimit: calculateGasBuffer(APPROVE),
      })
      await approvedResult.wait()
    }
  }

  const getPIQBalance = () => {
    if (pTokenBalance) return formatEther(pTokenBalance.value)
    return '0'
  }

  const getIQBalanceOnEth = () => {
    if (iqBalance) return formatEther(iqBalance.value)
    return '0'
  }

  const bridgeFromEthToEos = async (amount: string, eosAccount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)

    try {
      await needsApproval(amountParsed, config.pMinterAddress, iqErc20Contract)

      const { hash: waitForTheBurn } = await burn({ args: [amountParsed] })
      await waitForTransaction({ hash: waitForTheBurn })

      const { hash: waitForRedeemHash } = await redeem({
        args: [amountParsed, eosAccount.trim()],
        overrides: { gasLimit: 1e5 },
      })
      await waitForTransaction({ hash: waitForRedeemHash })
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)

    try {
      await needsApproval(amountParsed, config.pMinterAddress, pIqErc20Contract)

      const { hash: waitForMintHash } = await mint({
        args: [amountParsed],
        overrides: { gasLimit: 150e3 },
      })
      await waitForTransaction({ hash: waitForMintHash })
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
