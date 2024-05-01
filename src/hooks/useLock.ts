import hiIQABI from '@/abis/hiIQABI.abi'
import config from '@/config'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import erc20Abi from '@/abis/erc20.abi'
import { wagmiConfig } from '@/config/wagmi'

const hiiqContractConfig = {
  address: config.hiiqAddress as `0x${string}`,
  abi: hiIQABI,
}

const erc20ContractConfig = {
  address: config.iqAddress as `0x${string}`,
  abi: erc20Abi,
}

export const useLock = () => {
  const { address } = useAccount()

  const { writeContractAsync: createLock } = useWriteContract()
  const { writeContractAsync: increaseAmount } = useWriteContract()
  const { writeContractAsync: increaseUnlockTime } = useWriteContract()
  const { writeContractAsync: withdrawToken } = useWriteContract()
  const { data: allowanceToken, refetch: refetchedAllowanceToken } =
    useReadContract({
      ...erc20ContractConfig,
      functionName: 'allowance',
      args: [address as `0x${string}`, config.hiiqAddress as `0x${string}`],
    })
  const { data: approveHash, writeContractAsync: approve } = useWriteContract()

  const needsApproval = async (amount: bigint) => {
    if ((allowanceToken as bigint) < amount) {
      await approve({
        ...erc20ContractConfig,
        functionName: 'approve',
        args: [config.hiiqAddress as `0x${string}`, amount],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: approveHash as `0x${string}`,
      })
      const newAllowance = await refetchedAllowanceToken()
      return newAllowance.data
    }
    return allowanceToken
  }

  const lockIQ = async (amount: bigint, lockPeriod: number) => {
    const convertedDate = new Date()
    convertedDate.setDate(convertedDate.getDate() + lockPeriod)
    const timeParsed = Math.floor(convertedDate.getTime() / 1000.0)
    const newAllowance = await needsApproval(amount)
    if ((newAllowance as bigint) >= amount) {
      const result = await createLock({
        ...hiiqContractConfig,
        functionName: 'create_lock',
        args: [amount, BigInt(timeParsed)],
      })
      return result
    }
    return 'ALLOWANCE_ERROR'
  }

  const increaseLockAmount = async (amount: bigint) => {
    const newAllowance = await needsApproval(amount)
    if ((newAllowance as bigint) >= amount) {
      const result = await increaseAmount({
        ...hiiqContractConfig,
        functionName: 'increase_amount',
        args: [amount],
      })
      return result
    }

    return 'ALLOWANCE_ERROR'
  }

  const avoidMaxTimeUnlockTime = (unlockPeriod: number) => {
    let timeParsed = unlockPeriod / 1000.0
    const today = new Date().getTime() / 1000
    const diff = timeParsed - today
    if (Math.floor(diff / (3600 * 24)) / 365 > 4) {
      timeParsed = Math.ceil(today + 86400 * 4 * 365 - 60 * 30)
    }
    return timeParsed
  }

  const increaseLockPeriod = async (newUnlockPeriod: number) => {
    const timeParsed = avoidMaxTimeUnlockTime(newUnlockPeriod)
    const result = await increaseUnlockTime({
      ...hiiqContractConfig,
      functionName: 'increase_unlock_time',
      args: [BigInt(timeParsed)],
    })
    return result
  }

  const withdraw = async () => {
    const result = await withdrawToken({
      ...hiiqContractConfig,
      functionName: 'withdraw',
    })
    return result
  }

  return {
    lockIQ: (amount: bigint, lockPeriod: number) => lockIQ(amount, lockPeriod),
    increaseLockAmount: (amount: bigint) => increaseLockAmount(amount),
    increaseLockPeriod: (unlockPeriod: number) =>
      increaseLockPeriod(unlockPeriod),
    withdraw,
  }
}
