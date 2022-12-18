import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useProvider,
} from 'wagmi'
import { brainyAbi } from '@/abis/brainy.abi'
import config from '@/config'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  addressOrName: config.brainyAddress,
  contractInterface: brainyAbi,
}

export const useBrainy = () => {
  const provider = useProvider()

  const contract = useContract({
    addressOrName: config.brainyAddress,
    contractInterface: brainyAbi,
    signerOrProvider: provider,
  })

  const { address } = useAccount()

  const { data: balanceOf, refetch: refetchTheBalance } = useContractRead({
    ...contractConfig,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data: maxPerWallet } = useContractRead({
    ...contractConfig,
    functionName: 'getMaxPerWallet',
  })

  const { data: tokensMinted, refetch: refetchTokensMinted } = useContractRead({
    ...contractConfig,
    functionName: 'tokensMintedByPublicAddress',
    args: [address],
  })

  const { data: isApprovedForAll } = useContractRead({
    ...contractConfig,
    functionName: 'isApprovedForAll',
    args: [address, config.nftFarmAddress],
  })

  const { writeAsync: publicMint } = useContractWrite({
    ...contractConfig,
    functionName: 'publicMint',
  })

  const { writeAsync: setApprovalForAll } = useContractWrite({
    ...contractConfig,
    functionName: 'setApprovalForAll',
  })

  const canMint = () => {
    if (tokensMinted) {
      const alreadyMinted = Number(tokensMinted.toString())

      return alreadyMinted < 2
    }

    return true
  }

  const mintABrainy = async () => {
    try {
      const { wait: waitForTheMint } = await publicMint({
        overrides: { from: address },
        args: [1],
      })

      await waitForTheMint(3)
      await refetchTheBalance()
      await refetchTokensMinted()

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Brainy minted successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const approveTheTransferForAll = async () => {
    try {
      const { wait: waitForTheApproval } = await setApprovalForAll({
        args: [config.nftFarmAddress, true],
      })
      await waitForTheApproval()

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Transfer approved successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const getMintedNFTsByUser = async () => {
    try {
      if (!address) return undefined

      const mints = await contract.filters.Transfer(address)
      const decoded = await contract.queryFilter(mints, 0)

      if (decoded) {
        const nfts = []

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < decoded.length; i++) {
          const tokenId = Number(decoded[i].args.tokenId.toString())
          // eslint-disable-next-line no-await-in-loop
          const result: string = await contract.ownerOf(tokenId)
          if (result) nfts.push({ tokenId, owner: result })
        }

        return nfts
      }

      return undefined
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  return {
    mint: () => mintABrainy(),
    balance: balanceOf ? balanceOf.toString() : undefined,
    tokensMinted: tokensMinted ? tokensMinted.toString() : undefined,
    maxPerWallet: maxPerWallet?.toString(),
    canMint: canMint(),
    isApprovedForAll,
    approve: () => approveTheTransferForAll(),
    getMintedNFTsByUser: () => getMintedNFTsByUser(),
  }
}
