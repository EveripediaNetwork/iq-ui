import config from '@/config'
import { hiIQABI, erc20 } from '@/config/abis'
import { GAS_LIMIT } from '@/data/LockConstants'
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

  return {
    lockIQ: (amount: number, lockPeriod: number) => lockIQ(amount, lockPeriod),
    increaseLockAmount: (amount: number) => increaseLockAmount(amount),
  }
}
