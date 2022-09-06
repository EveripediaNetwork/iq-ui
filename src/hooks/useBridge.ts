import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useSigner,
} from 'wagmi'
import { BigNumber, Signer, utils, constants } from 'ethers'
import { erc20Abi } from '@/abis/erc20.abi'
import { minterAbi } from '@/abis/minter.abi'
import { ptokenAbi } from '@/abis/ptoken.abi'
import config from '@/config'

export const useBridge = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { writeAsync: mint } = useContractWrite({
    addressOrName: config.pMinterAddress,
    contractInterface: minterAbi,
    functionName: 'mint',
  })

  const { writeAsync: burn } = useContractWrite({
    addressOrName: config.pMinterAddress,
    contractInterface: minterAbi,
    functionName: 'burn',
  })

  const { data: pTokenBalance } = useContractRead({
    addressOrName: config.pIqAddress,
    contractInterface: erc20Abi,
    functionName: 'balanceOf',
    watch: true,
    args: [address],
  })

  const { data: iqBalance } = useContractRead({
    addressOrName: config.iqAddress,
    contractInterface: erc20Abi,
    functionName: 'balanceOf',
    watch: true,
    args: [address],
  })

  const { writeAsync: redeem } = useContractWrite({
    addressOrName: config.pIqAddress,
    contractInterface: ptokenAbi,
    functionName: 'redeem',
  })

  const erc20Contract = useContract({
    addressOrName: config.iqAddress,
    contractInterface: erc20Abi,
    signerOrProvider: signer as Signer,
  })

  const needsApproval = async (amount: BigNumber, spender: string) => {
    const allowedTokens = await erc20Contract.allowance(address, spender)
    if (allowedTokens.lt(amount)) {
      await erc20Contract.approve(spender, constants.MaxUint256)
    }
  }

  const getPIQBalance = () => {
    if (pTokenBalance) return utils.formatEther(pTokenBalance)

    return '0'
  }

  const getIQBalanceOnEth = () => {
    if (iqBalance) return utils.formatEther(iqBalance)

    return '0'
  }

  const bridgeFromEthToEos = async (amount: string, eosAccount: string) => {
    const amountParsed = utils.parseEther(amount)

    await needsApproval(amountParsed, config.pMinterAddress)

    await burn({ args: [amountParsed] })

    const result = await redeem({
      args: [amountParsed, eosAccount],
      overrides: { gasLimit: 5e5 },
    })

    return result
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = utils.parseEther(amount)

    await needsApproval(amountParsed, config.pMinterAddress)

    const result = await mint({
      args: [amountParsed],
      overrides: { gasLimit: 5e5 },
    })
    return result
  }

  return {
    pIQBalance: getPIQBalance(),
    iqBalanceOnEth: getIQBalanceOnEth(),
    bridgeFromEthToEos: (amount: string, eosAccount: string) =>
      bridgeFromEthToEos(amount, eosAccount),
    bridgeFromPTokenToEth: (amount: string) => bridgeFromPTokenToEth(amount),
  }
}
