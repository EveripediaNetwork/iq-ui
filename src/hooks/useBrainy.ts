import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { getContract, getWalletClient, waitForTransaction } from 'wagmi/actions'
import { brainyAbi } from '@/abis/brainy.abi'
import config from '@/config'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  address: config.brainyAddress as `0x${string}`,
  abi: brainyAbi,
}
const walletClient = await getWalletClient()
export const useBrainy = () => {
  const { currentStakingAddress } = useSelector(
    (state: RootState) => state.nftFarms,
  )

  const contract = getContract({
    address: config.brainyAddress as `0x${string}`,
    abi: brainyAbi,
    walletClient: walletClient,
  })

  const { address } = useAccount()

  const { data: balanceOf, refetch: refetchTheBalance } = useContractRead({
    ...contractConfig,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const { data: maxPerWallet } = useContractRead({
    ...contractConfig,
    functionName: 'getMaxPerWallet',
  })

  const { data: tokensMinted, refetch: refetchTokensMinted } = useContractRead({
    ...contractConfig,
    functionName: 'tokensMintedByPublicAddress',
    args: [address as `0x${string}`],
  })

  const { data: totalSupply } = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
  })

  const { data: status } = useContractRead({
    ...contractConfig,
    functionName: 'status',
  })

  const { writeAsync: publicMint } = useContractWrite({
    ...contractConfig,
    functionName: 'publicMint',
  })

  const { writeAsync: approve } = useContractWrite({
    ...contractConfig,
    functionName: 'approve',
  })

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

      const mints = contract.watchEvent.Transfer(
        {
          from: address,
        },
        {
          onLogs(logs: any) {
            console.log(logs)
          },
        },
      )
      const decoded = await contract.queryFilter(mints)

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
      const { hash } = await publicMint({
        args: [BigInt(1)],
      })
      await waitForTransaction({ hash })
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
      const { hash: waitForTheApprovalHash } = await approve({
        args: [currentStakingAddress as `0x${string}`, BigInt(tokenId)],
      })
      const _receipt = await waitForTransaction({
        hash: waitForTheApprovalHash,
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
