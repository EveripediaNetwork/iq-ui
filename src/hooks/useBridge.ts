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

  // const {
  //   data: mintResult,
  //   isLoading: isLoadingMint,
  //   write: mint,
  // } = useContractWrite({
  //   addressOrName: '0x483488B7D897b429AE851FEef1fA02d96475cc23', // TODO: move to env
  //   contractInterface: minterAbi,
  //   functionName: 'mint',
  // })

  const { writeAsync: burn } = useContractWrite({
    addressOrName: config.pMinterAddress, // TODO: move to env
    contractInterface: minterAbi,
    functionName: 'burn',
  })

  const { data: pTokenBalanceOfData } = useContractRead({
    addressOrName: config.pIqAddress,
    contractInterface: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data: balanceOfData } = useContractRead({
    addressOrName: config.iqAddress,
    contractInterface: erc20Abi,
    functionName: 'balanceOf',
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
    if (pTokenBalanceOfData) return utils.formatEther(pTokenBalanceOfData)

    return '0'
  }

  const getIQBalanceOnEth = () => {
    if (balanceOfData) return utils.formatEther(balanceOfData)

    return '0'
  }

  const bridgeFromEthToEos = async (amount: string, eosAccount: string) => {
    const amountParsed = utils.parseEther(amount)

    await needsApproval(amountParsed, config.pMinterAddress)

    await burn({ args: [amountParsed] })

    console.log(amountParsed)
    console.log(eosAccount)

    const result = await redeem({
      args: [amountParsed, eosAccount],
      overrides: { gasLimit: 5e5 },
    })

    return result
  }

  return {
    pIQBalance: getPIQBalance(),
    iqBalanceOnEth: getIQBalanceOnEth(),
    bridgeFromEthToEos: (amount: string, eosAccount: string) =>
      bridgeFromEthToEos(amount, eosAccount),
  }
}
