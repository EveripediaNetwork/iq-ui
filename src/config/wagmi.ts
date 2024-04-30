import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'
import { virtualMainnet } from './tenderly.config'

import config from './index'

const chains =
  config.alchemyChain === 'goerli'
    ? ([virtualMainnet] as const)
    : ([mainnet] as const)

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: config.walletConnectProjectId || '',
      relayUrl: 'wss://relay.walletconnect.org',
    }),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`,
    ),
    [virtualMainnet.id]: http(
      'https://virtual.mainnet.rpc.tenderly.co/03b11be5-eb34-47f8-9940-02979425b7e4',
    ),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
