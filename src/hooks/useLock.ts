import config from '@/config'
import { hiIQABI, erc20 } from '@/config/abis'
import { GAS_LIMIT } from '@/data/LockConstants'
import { addGasLimitBuffer } from '@/utils/LockOverviewUtils'
import { ContractInterface } from '@ethersproject/contracts'
import { BigNumber, ethers, Signer } from 'ethers'
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

  const needsApproval = async (amount: BigNumber, hashes: string[]) => {
    const allowedTokens = await erc20Contracts.allowance(
      address,
      config.hiiqAddress,
    )
    if (allowedTokens.lt(amount)) {
      const approveResult = await erc20Contracts.approve(
        config.hiiqAddress,
        ethers.constants.MaxUint256,
      )
      hashes.push(approveResult.hash)
    }

    return hashes
  }

  const lockIQ = async (amount: number, lockPeriod: number) => {
    const parsedAmount = ethers.utils.parseEther(amount.toString())
    const convertedDate = new Date()
    convertedDate.setDate(convertedDate.getDate() + lockPeriod)
    const timeParsed = Math.floor(convertedDate.getTime() / 1000.0)
    const hashes = await needsApproval(parsedAmount, [])
    if (hashes) {
      const result = await hiiqContracts.create_lock(
        parsedAmount,
        String(timeParsed),
        {
          gasLimit: GAS_LIMIT,
        },
      )
      return result
    }
    return false
  }

  const increaseLockAmount = async (amount: number) => {
    const parsedAmount = ethers.utils.parseEther(amount.toString())
    const hashes = await needsApproval(parsedAmount, [])
    if (hashes) {
      const result = await hiiqContracts.increase_amount(parsedAmount, {
        gasLimit: GAS_LIMIT,
      })
      return result
    }
    return false
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
      gasLimit: GAS_LIMIT,
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
    lockIQ: (amount: number, lockPeriod: number) => lockIQ(amount, lockPeriod),
    increaseLockAmount: (amount: number) => increaseLockAmount(amount),
    increaseLockPeriod: (unlockPeriod: number) =>
      increaseLockPeriod(unlockPeriod),
    withdraw,
  }
}
