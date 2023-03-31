import {
  useAccount,
  useBalance,
  useContract,
  useContractWrite,
  useSigner,
} from 'wagmi'
import { BigNumber, Signer, utils, constants, Contract } from 'ethers'
import { erc20Abi } from '@/abis/erc20.abi'
import { minterAbi } from '@/abis/minter.abi'
import { ptokenAbi } from '@/abis/ptoken.abi'
import config from '@/config'
import { getError } from '@/utils/getError'
import { usePTokensBalance } from '@/utils/fetch-ptoken-balance'

export const useBridge = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const {data, refetch} = usePTokensBalance()

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

  const { writeAsync: redeem } = useContractWrite({
    addressOrName: config.pIqAddress,
    contractInterface: ptokenAbi,
    functionName: 'redeem',
  })

  const { data: pTokenBalance, refetch: refetchPTokenBalance } = useBalance({
    addressOrName: address,
    token: config.pIqAddress,
  })

  const { data: iqBalance } = useBalance({
    addressOrName: address,
    token: config.iqAddress,
  })

  const iqErc20Contract = useContract({
    addressOrName: config.iqAddress,
    contractInterface: erc20Abi,
    signerOrProvider: signer as Signer,
  })

  const pIqErc20Contract = useContract({
    addressOrName: config.pIqAddress,
    contractInterface: erc20Abi,
    signerOrProvider: signer as Signer,
  })

  const needsApproval = async (
    amount: BigNumber,
    spender: string,
    erc20: Contract,
  ) => {
    const allowedTokens = await erc20.allowance(address, spender)
    if (allowedTokens.lt(amount)) {
      const approvedResult = await erc20.approve(spender, constants.MaxUint256)
      await approvedResult.wait()
    }
  }

  const getPIQBalance = () => {
    if (pTokenBalance) return utils.formatEther(pTokenBalance.value)
    return '0'
  }

  const getIQBalanceOnEth = () => {
    if (iqBalance) return utils.formatEther(iqBalance.value)
    return '0'
  }

  const bridgeFromEthToEos = async (amount: string, eosAccount: string) => {
    const amountParsed = utils.parseEther(amount)

    try {
      await needsApproval(amountParsed, config.pMinterAddress, iqErc20Contract)

      const { wait: waitForTheBurn } = await burn({ args: [amountParsed] })
      await waitForTheBurn()

      const { wait: waitForRedeem } = await redeem({
        args: [amountParsed, eosAccount],
        overrides: { gasLimit: 1e5 },
      })
      await waitForRedeem()
      return { error: undefined }
    } catch (error) {
      return getError(error)
    }
  }

  const bridgeFromPTokenToEth = async (amount: string) => {
    const amountParsed = utils.parseEther(amount)

    try {
      await needsApproval(amountParsed, config.pMinterAddress, pIqErc20Contract)

      const { wait: waitForMint } = await mint({
        args: [amountParsed],
        overrides: { gasLimit: 150e3 },
      })
      await waitForMint(3)
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
