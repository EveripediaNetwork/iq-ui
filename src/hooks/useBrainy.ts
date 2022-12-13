import { brainyAbi } from '@/abis/brainy.abi'
import config from '@/config'
import { useAccount, useContractWrite } from 'wagmi'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  addressOrName: config.brainyAddress,
  contractInterface: brainyAbi,
}

export const useBrainy = () => {
  const { address, isDisconnected } = useAccount()
  const { writeAsync: publicMint } = useContractWrite({
    ...contractConfig,
    functionName: 'publicMint',
  })

  const mintABrainy = async () => {
    if (isDisconnected) return

    try {
      await publicMint({ overrides: { from: address }, args: [0, 1] })

      // eslint-disable-next-line consistent-return
      return { isError: false, msg: 'Brainy minted successfully' }
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  return {
    mint: () => mintABrainy(),
  }
}
