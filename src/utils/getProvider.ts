import config from '@/config'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const client: any = createPublicClient({
  chain: mainnet,
  transport: http(`${config.ensRPC}`),
})
