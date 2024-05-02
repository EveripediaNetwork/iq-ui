import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import minterAbi from '@/abis/minter.abi'
import ptokenAbi from '@/abis/ptoken.abi'
import config from '@/config'
import { getError } from '@/utils/getError'
import { usePTokensBalance } from '@/utils/fetch-ptoken-balance'
import { calculateGasBuffer } from '@/utils/LockOverviewUtils'
import { APPROVE } from '@/data/LockConstants'
import { formatEther, parseEther } from 'viem'
import erc20Abi from '@/abis/erc20.abi'
import { wagmiConfig } from '@/config/wagmi'

export const useBridge = () => {
  const { address } = useAccount()
  const maxUint256 = BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  )

  const { data, refetch } = usePTokensBalance()

  const { data: allowedIqTokens } = useReadContract({
    address: config.iqAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, config.pMinterAddress as `0x${string}`],
  })
  const { data: approveIqHash, writeContractAsync: approveIq } =
    useWriteContract()

  const { data: allowedPiqTokens, refetch: refetchedPiq } = useReadContract({
    address: config.pIqAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, config.pMinterAddress as `0x${string}`],
  })

  const { data: approvePiqHash, writeContractAsync: approvePiq } =
    useWriteContract()
  const { data: mintHash, writeContractAsync: mint } = useWriteContract()
  const { data: burnHash, writeContractAsync: burn } = useWriteContract()
  const { data: redeemHash, writeContractAsync: redeem } = useWriteContract()

  const { data: pTokenBalance, refetch: refetchPTokenBalance } = useBalance({
    address: address,
    token: config.pIqAddress as `0x${string}`,
  })

  const { data: iqBalance } = useBalance({
    address: address,
    token: config.iqAddress as `0x${string}`,
  })

  const needsApprovalIq = async (amount: bigint, spender: `0x${string}`) => {
    if (!allowedIqTokens) return
    if (allowedIqTokens < amount) {
      await approveIq({
        address: config.iqAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        gas: BigInt(calculateGasBuffer(APPROVE)),
        args: [spender, maxUint256],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: approveIqHash as `0x${string}`,
      })
    }
  }

  const needsApprovalPiq = async (amount: bigint, spender: `0x${string}`) => {
    if ((allowedPiqTokens as bigint) < amount) {
      await approvePiq({
        address: config.pIqAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender as `0x${string}`, amount],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: approvePiqHash as `0x${string}`,
      })
      const newAllowance = await refetchedPiq()
      return newAllowance.data
    }
    return allowedPiqTokens
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
      await needsApprovalIq(
        amountParsed,
        config.pMinterAddress as `0x${string}`,
      )
      await burn({
        address: config.pIqAddress as `0x${string}`,
        abi: minterAbi,
        functionName: 'burn',
        args: [amountParsed],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: burnHash as `0x${string}`,
      })
      await redeem({
        address: config.pIqAddress as `0x${string}`,
        abi: ptokenAbi,
        functionName: 'redeem',
        gas: BigInt(1e5),
        args: [amountParsed, eosAccount.trim()],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: redeemHash as `0x${string}`,
      })
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)
    try {
      const newAllowance = await needsApprovalPiq(
        amountParsed,
        config.pMinterAddress as `0x${string}`,
      )
      if ((newAllowance as bigint) >= amountParsed) {
        await mint({
          address: config.pMinterAddress as `0x${string}`,
          abi: minterAbi,
          functionName: 'mint',
          gas: BigInt(150e3),
          args: [amountParsed],
        })
        await waitForTransactionReceipt(wagmiConfig, {
          hash: mintHash as `0x${string}`,
        })
        refetchPTokenBalance()
        refetch()
        return { error: undefined }
      }
      return { error: 'ALLOWANCE ERROR' }
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
