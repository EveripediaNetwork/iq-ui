import {
  useAccount,
  useBalance,
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

  const { data: allowedIqTokens } = useContractRead({
    address: config.iqAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address, config.pMinterAddress],
  })

  const { data: approvedIqResult, write: approveIq } = useContractWrite({
    address: config.iqAddress,
    abi: erc20Abi,
    functionName: 'approve',
  })

  const { data: allowedPiqTokens } = useContractRead({
    address: config.pIqAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address, config.pMinterAddress],
  })

  const { data: approvedPiqResult, write: approvePiq } = useContractWrite({
    address: config.pIqAddress,
    abi: erc20Abi,
    functionName: 'approve',
  })

  const { data: mintData, write: mint } = useContractWrite({
    address: config.pMinterAddress,
    abi: minterAbi,
    functionName: 'mint',
  })

  const { data: burnData, write: burn } = useContractWrite({
    address: config.pMinterAddress,
    abi: minterAbi,
    functionName: 'burn',
  })

  const { data: redeemData, write: redeem } = useContractWrite({
    address: config.pIqAddress,
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

  const needsApprovalIq = async (amount: bigint, spender: string) => {
    if (allowedIqTokens.lt(amount)) {
      approveIq({
        args: [
          spender,
          maxUint256,
          {
            gasLimit: calculateGasBuffer(APPROVE),
          },
        ],
      })
      await waitForTransaction({ hash: approvedIqResult?.hash })
    }
  }

  const needsApprovalPiq = async (amount: bigint, spender: string) => {
    if (allowedPiqTokens.lt(amount)) {
      approvePiq({
        args: [
          spender,
          maxUint256,
          {
            gasLimit: calculateGasBuffer(APPROVE),
          },
        ],
      })
      await waitForTransaction({ hash: approvedPiqResult?.hash })
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
      await needsApprovalIq(amountParsed, config.pMinterAddress)

      burn({ args: [amountParsed] })
      await waitForTransaction({ hash: burnData?.hash })

      redeem({
        args: [amountParsed, eosAccount.trim()],
        overrides: { gasLimit: 1e5 },
      })
      await waitForTransaction({ hash: redeemData?.hash })
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)

    try {
      await needsApprovalPiq(amountParsed, config.pMinterAddress)

      mint({
        args: [amountParsed],
        overrides: { gasLimit: 150e3 },
      })
      await waitForTransaction({ hash: mintData?.hash })
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
