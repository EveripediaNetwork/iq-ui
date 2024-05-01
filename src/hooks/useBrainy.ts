import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { getContract, http, createPublicClient } from 'viem'
import brainyAbi from '@/abis/brainy.abi'
import config from '@/config'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { wagmiConfig } from '@/config/wagmi'
import { mainnet } from 'viem/chains'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  address: config.brainyAddress as `0x${string}`,
  abi: brainyAbi,
}

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const useBrainy = () => {
  const { data: brainyHash, writeContract: publicMint } = useWriteContract()
  const { data: approveHash, writeContract: approveBrainy } = useWriteContract()
  const { currentStakingAddress } = useSelector(
    (state: RootState) => state.nftFarms,
  )

  const contract = getContract({
    address: config.brainyAddress as `0x${string}`,
    abi: brainyAbi,
    client: publicClient,
  })

  const { address } = useAccount()

  const { data: balanceOf, refetch: refetchTheBalance } = useReadContract({
    ...contractConfig,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const { data: maxPerWallet } = useReadContract({
    ...contractConfig,
    functionName: 'getMaxPerWallet',
  })

  const { data: tokensMinted, refetch: refetchTokensMinted } = useReadContract({
    ...contractConfig,
    functionName: 'tokensMintedByPublicAddress',
    args: [address as `0x${string}`],
  })

  const { data: totalSupply } = useReadContract({
    ...contractConfig,
    functionName: 'totalSupply',
  })

  const { data: status } = useReadContract({
    ...contractConfig,
    functionName: 'status',
  })

  //   const publicMint = (args) =>{
  //     writeContract({
  //       abi: brainyAbi,
  //       address: config.brainyAddress as `0x${string}`,
  //       value: BigInt(0),
  //       functionName: 'publicMint',
  //       args: [args]
  //     })
  // }

  // const { writeContractAsync: approve } = writeContract({
  //   abi: brainyAbi,
  //   address: config.brainyAddress as `0x${string}`,
  //   functionName: 'approve',
  //   args: [],
  // })

  const canMint = () => {
    if (tokensMinted) {
      const alreadyMinted = Number(tokensMinted.toString())

      return alreadyMinted < 2
    }

    return true
  }

  const getMintedNFTsByUser = async () => {
    try {
      if (!address) return undefined

      const { filters, queryFilter } = contract as any
      const mints = filters.Transfer()
      const decoded = await queryFilter(mints)

      if (decoded) {
        const nfts = []
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < decoded.length; i++) {
          const tokenId = Number(decoded[i].args.tokenId.toString())
          // eslint-disable-next-line no-await-in-loop
          const result: string = await contract.read.ownerOf([BigInt(tokenId)])
          if (result === address) nfts.push({ tokenId })
        }
        return { isError: false, nfts }
      }

      return { isError: false }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const getTokenURI = async (tokenId: number) => {
    try {
      const tokenURI = await contract.read.tokenURI([BigInt(tokenId)])
      return { isError: false, tokenURI }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const mintABrainy = async () => {
    try {
      publicMint({
        abi: brainyAbi,
        address: config.brainyAddress as `0x${string}`,
        value: BigInt(0),
        functionName: 'publicMint',
        args: [BigInt(1)],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: brainyHash as `0x${string}`,
      })
      await refetchTheBalance()
      await refetchTokensMinted()
      await getMintedNFTsByUser()

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Brainy minted successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const isTheCurrentUserTheOwner = async (tokenId: number) => {
    const owner: string = await contract.read.ownerOf([BigInt(tokenId)])
    return owner === address
  }

  const approveTheTransfer = async (tokenId: number) => {
    try {
      approveBrainy({
        abi: brainyAbi,
        address: config.brainyAddress as `0x${string}`,
        functionName: 'approve',
        args: [currentStakingAddress as `0x${string}`, BigInt(tokenId)],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: approveHash as `0x${string}`,
      })

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Transfer approved successfully' }
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
    isTheOwner: (tokenId: number) => isTheCurrentUserTheOwner(tokenId),
    approve: (tokenId: number) => approveTheTransfer(tokenId),
    getMintedNFTsByUser: () => getMintedNFTsByUser(),
    totalSupply: totalSupply ? Number(totalSupply.toString()) : 0,
    status: status ? Number(status.toString()) : 0,
    tokenURI: (tokenId: number) => getTokenURI(tokenId),
  }
}
