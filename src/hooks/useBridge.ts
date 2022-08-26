import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { utils } from 'ethers'
import { erc20Abi } from '@/abis/erc20.abi'
import { minterAbi } from '@/abis/minter.abi'
import { ptokenAbi } from '@/abis/ptoken.abi'

export const useBridge = () => {
  const { address } = useAccount()

  // const {
  //   data: mintResult,
  //   isLoading: isLoadingMint,
  //   write: mint,
  // } = useContractWrite({
  //   addressOrName: '0x483488B7D897b429AE851FEef1fA02d96475cc23', // TODO: move to env
  //   contractInterface: minterAbi,
  //   functionName: 'mint',
  // })

  // const {
  //   data: burnResult,
  //   isLoading: isBurning,
  //   write: burn,
  // } = useContractWrite({
  //   addressOrName: '0x483488B7D897b429AE851FEef1fA02d96475cc23', // TODO: move to env
  //   contractInterface: minterAbi,
  //   functionName: 'burn',
  // })

  const {
    data: pTokenBalanceOfData,
  } = useContractRead({
    addressOrName: '0xbff1365cf0a67431484c00c63bf14cfd9abbce5d',
    contractInterface: erc20Abi,
    functionName: 'balanceOf',
    args: [address]
  })

  const {
    data: balanceOfData,
  } = useContractRead({
    addressOrName: '0x0552D756a3E92Aa874EF60F61b7a29030373e869',
    contractInterface: erc20Abi,
    functionName: 'balanceOf',
    args: [address]
  })

  const getPIQBalance = () => {
    if (pTokenBalanceOfData)
      return utils.formatEther(pTokenBalanceOfData)

    return "0"
  }

  const getIQBalanceOnEth = () => {
    console.log(balanceOfData)
    if (balanceOfData)
      return utils.formatEther(balanceOfData)

    return "0"
  }

  return {
    iqBalanceOnEth: getIQBalanceOnEth()
  }
}
