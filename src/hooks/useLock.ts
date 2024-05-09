import hiIQABI from '@/abis/hiIQABI.abi'
import config from '@/config'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { waitForTransaction } from 'wagmi/actions'
import erc20Abi from '@/abis/erc20.abi'

const hiiqContractConfig = {
  address: config.hiiqAddress as `0x${string}`,
  abi: hiIQABI,
}

//use WIQ for dev
const erc20ContractConfig =
  config.alchemyChain === 'iqChain'
    ? {
        address: config.wiqAddress as `0x${string}`,
        abi: erc20Abi,
      }
    : {
        address: config.iqAddress as `0x${string}`,
        abi: erc20Abi,
      }

export const useLock = () => {
  const { address } = useAccount()

  const { writeAsync: createLock } = useContractWrite({
    ...hiiqContractConfig,
    functionName: 'create_lock',
  })

  const { writeAsync: increaseAmount } = useContractWrite({
    ...hiiqContractConfig,
    functionName: 'increase_amount',
  })

  const { writeAsync: increaseUnlockTime } = useContractWrite({
    ...hiiqContractConfig,
    functionName: 'increase_unlock_time',
  })

  const { writeAsync: withdrawToken } = useContractWrite({
    ...hiiqContractConfig,
    functionName: 'withdraw',
  })

  const { data: allowanceToken, refetch: refetchedAllowanceToken } =
    useContractRead({
      ...erc20ContractConfig,
      functionName: 'allowance',
      args: [address as `0x${string}`, config.hiiqAddress as `0x${string}`],
    })

  const { writeAsync: approve } = useContractWrite({
    ...erc20ContractConfig,
    functionName: 'approve',
  })

  const needsApproval = async (amount: bigint) => {
    if ((allowanceToken as bigint) < amount) {
      const { hash } = await approve({
        args: [config.hiiqAddress as `0x${string}`, amount],
      })
      await waitForTransaction({ hash })
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
      args: [BigInt(timeParsed)],
    })
    return result
  }

  const withdraw = async () => {
    const result = await withdrawToken()
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
