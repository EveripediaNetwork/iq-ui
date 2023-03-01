import config from '@/config'
import { hiIQABI, erc20 } from '@/config/abis'
import {
  LOCK_AND_WITHDRAWAL_GAS_LIMIT,
  LOCK_UPDATE_GAS_LIMIT,
} from '@/data/LockConstants'
import {
  addGasLimitBuffer,
  calculateGasBuffer,
} from '@/utils/LockOverviewUtils'
import { ContractInterface } from '@ethersproject/contracts'
import { BigNumber, Signer } from 'ethers'
import { useAccount, useContract, useSigner } from 'wagmi'

const hiiqContractConfig = {
  addressOrName: config.hiiqAddress,
  contractInterface: hiIQABI as ContractInterface,
}

const erc20ContractConfig = {
  addressOrName: config.iqAddress,
  contractInterface: erc20 as ContractInterface,
}

export const useLock = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const hiiqContracts = useContract({
    ...hiiqContractConfig,
    signerOrProvider: signer as Signer,
  })

  const erc20Contracts = useContract({
    ...erc20ContractConfig,
    signerOrProvider: signer as Signer,
  })

  const needsApproval = async (amount: BigNumber) => {
    const allowedTokens = await erc20Contracts.allowance(
      address,
      config.hiiqAddress,
    )
    if (allowedTokens.lt(amount)) {
      const approval = await erc20Contracts.approve(config.hiiqAddress, amount)
      await approval.wait()
    }
  }

  const lockIQ = async (amount: BigNumber, lockPeriod: number) => {
    const convertedDate = new Date()
    convertedDate.setDate(convertedDate.getDate() + lockPeriod)
    const timeParsed = Math.floor(convertedDate.getTime() / 1000.0)
    await needsApproval(amount)
    const newAllowedTokens = await erc20Contracts.allowance(
      address,
      config.hiiqAddress,
    )
    if (newAllowedTokens.gte(amount)) {
      const result = await hiiqContracts.create_lock(
        amount,
        String(timeParsed),
        {
          gasLimit: calculateGasBuffer(LOCK_AND_WITHDRAWAL_GAS_LIMIT),
        },
      )
      return result
    }
    return 'allowance_error'
  }

  const increaseLockAmount = async (amount: BigNumber) => {
    await needsApproval(amount)
    const newAllowedTokens = await erc20Contracts.allowance(
      address,
      config.hiiqAddress,
    )
    if (newAllowedTokens.gte(amount)) {
      const result = await hiiqContracts.increase_amount(amount, {
        gasLimit: calculateGasBuffer(LOCK_UPDATE_GAS_LIMIT),
      })
      return result
    }

    return 'allowance_error'
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
    lockIQ: (amount: BigNumber, lockPeriod: number) =>
      lockIQ(amount, lockPeriod),
    increaseLockAmount: (amount: BigNumber) => increaseLockAmount(amount),
    increaseLockPeriod: (unlockPeriod: number) =>
      increaseLockPeriod(unlockPeriod),
    withdraw,
  }
}
