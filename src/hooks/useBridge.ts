import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
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
  const maxUint256 = BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  )

  const { data, refetch } = usePTokensBalance()

  const { data: allowedIqTokens } = useContractRead({
    address: config.iqAddress as `0x${string}`,
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'allowance',
    args: [address as `0x${string}`, config.pMinterAddress as `0x${string}`],
  })

  const { writeAsync: approveIq } = useContractWrite({
    address: config.iqAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'approve',
  })

  const { data: allowedPiqTokens } = useContractRead({
    address: config.pIqAddress as `0x${string}`,
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'allowance',
    args: [address as `0x${string}`, config.pMinterAddress as `0x${string}`],
  })

  const { writeAsync: approvePiq } = useContractWrite({
    address: config.pIqAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'approve',
  })

  const { writeAsync: mint } = useContractWrite({
    address: config.pMinterAddress as `0x${string}`,
    abi: minterAbi,
    functionName: 'mint',
    gas: BigInt(150e3),
  })

  const { writeAsync: burn } = useContractWrite({
    address: config.pMinterAddress as `0x${string}`,
    abi: minterAbi,
    functionName: 'burn',
  })

  const { writeAsync: redeem } = useContractWrite({
    address: config.pIqAddress as `0x${string}`,
    abi: ptokenAbi,
    functionName: 'redeem',
    gas: BigInt(1e5),
  })

  const { data: pTokenBalance, refetch: refetchPTokenBalance } = useBalance({
    address: address,
    token: config.pIqAddress as `0x${string}`,
  })

  const { data: iqBalance } = useBalance({
    address: address,
    token: config.iqAddress as `0x${string}`,
  })

  const needsApprovalIq = async (amount: bigint, spender: string) => {
    if (!allowedIqTokens) return
    if (allowedIqTokens < amount) {
      const { hash: approvedIqResultHash } = await approveIq({
        args: [
          spender,
          maxUint256,
          {
            gasLimit: calculateGasBuffer(APPROVE),
          },
        ],
      })
      await waitForTransaction({ hash: approvedIqResultHash })
    }
  }

  const needsApprovalPiq = async (amount: bigint, spender: string) => {
    if (!allowedPiqTokens) return
    if (allowedPiqTokens < amount) {
      const { hash: approvedPiqResultHash } = await approvePiq({
        args: [
          spender,
          maxUint256,
          {
            gasLimit: calculateGasBuffer(APPROVE),
          },
        ],
      })
      await waitForTransaction({ hash: approvedPiqResultHash })
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
      const { hash: burnDataHash } = await burn({ args: [amountParsed] })
      await waitForTransaction({ hash: burnDataHash })
      const { hash: redeemDataHash } = await redeem({
        args: [amountParsed, eosAccount.trim()],
      })
      await waitForTransaction({ hash: redeemDataHash })
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = parseEther(`${Number(amount)}`)

    try {
      await needsApprovalPiq(amountParsed, config.pMinterAddress)
      const { hash: mintDataHash } = await mint({
        args: [amountParsed],
      })
      await waitForTransaction({ hash: mintDataHash })
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
