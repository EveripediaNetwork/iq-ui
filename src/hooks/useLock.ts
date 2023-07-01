import config from '@/config'
import { hiIQABI, erc20 } from '@/config/abis'
import {
  APPROVE,
  LOCK_AND_WITHDRAWAL_GAS_LIMIT,
  LOCK_UPDATE_GAS_LIMIT,
} from '@/data/LockConstants'
import {
  addGasLimitBuffer,
  calculateGasBuffer,
} from '@/utils/LockOverviewUtils'
import { useAccount, useWalletClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

const hiiqContractConfig = {
  address: config.hiiqAddress as `0x${string}`,
  abi: hiIQABI,
}

const erc20ContractConfig = {
  address: config.iqAddress as `0x${string}`,
  abi: erc20,
}

export const useLock = () => {
  const { address } = useAccount()
  // const { data: walletClient } = useWalletClient()

  const hiiqContracts = getContract({
    ...hiiqContractConfig,
    // signerOrProvider: signer,
  })

  const erc20Contracts = getContract({
    ...erc20ContractConfig,
    // signerOrProvider: signer,
  })

  const tokenAllowance = async () => {
    const result = await erc20Contracts.allowance(address, config.hiiqAddress)
    return result
  }

  const needsApproval = async (amount: BigInt) => {
    const allowedTokens = await tokenAllowance()
    if (allowedTokens.lt(amount)) {
      const approval = await erc20Contracts.approve(
        config.hiiqAddress,
        amount,
        {
          gasLimit: calculateGasBuffer(APPROVE),
        },
      )
      await approval.wait()
    }
  }

  const lockIQ = async (amount: BigInt, lockPeriod: number) => {
    const convertedDate = new Date()
    convertedDate.setDate(convertedDate.getDate() + lockPeriod)
    const timeParsed = Math.floor(convertedDate.getTime() / 1000.0)
    await needsApproval(amount)
    const allowedTokens = await tokenAllowance()
    if (allowedTokens.gte(amount)) {
      const result = await hiiqContracts.create_lock(
        amount,
        String(timeParsed),
        {
          gasLimit: calculateGasBuffer(LOCK_AND_WITHDRAWAL_GAS_LIMIT),
        },
      )
      return result
    }
    return 'ALLOWANCE_ERROR'
  }

  const increaseLockAmount = async (amount: BigInt) => {
    await needsApproval(amount)
    const allowedTokens = await tokenAllowance()
    if (allowedTokens.gte(amount)) {
      const result = await hiiqContracts.increase_amount(amount, {
        gasLimit: calculateGasBuffer(LOCK_UPDATE_GAS_LIMIT),
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
    const result = await hiiqContracts.increase_unlock_time(timeParsed, {
      gasLimit: calculateGasBuffer(LOCK_UPDATE_GAS_LIMIT),
    })
    return result
  }

  const withdraw = async () => {
    const result = await hiiqContracts.withdraw({
      gasLimit: addGasLimitBuffer(await hiiqContracts.estimateGas.withdraw()),
    })
    return result
  }

  return {
    lockIQ: (amount: BigInt, lockPeriod: number) => lockIQ(amount, lockPeriod),
    increaseLockAmount: (amount: BigInt) => increaseLockAmount(amount),
    increaseLockPeriod: (unlockPeriod: number) =>
      increaseLockPeriod(unlockPeriod),
    withdraw,
  }
}
