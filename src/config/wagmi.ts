import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { mainnet } from 'wagmi'
import { configureChains } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { defineChain } from 'viem'

import config from './index'

type Connector = MetaMaskConnector | WalletConnectConnector

export const iqTestnet = defineChain({
  id: 313_377,
  name: 'IQ Testnet',
  network: 'IQ Testnet',
  nativeCurrency: {
    name: 'IQ Token',
    symbol: 'IQ',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.braindao.org/'] },
    public: { http: ['https://rpc-testnet.braindao.org/'] },
  },
  blockExplorers: {
    default: { name: 'BrainScan', url: config.blockExplorerUrl },
  },
  testnet: true,
})

export const { chains, publicClient, webSocketPublicClient } = config.isProd
  ? configureChains(
      [mainnet],
      [alchemyProvider({ apiKey: config.alchemyApiKey }), publicProvider()],
    )
  : configureChains(
      [iqTestnet],
      [
        jsonRpcProvider({
          rpc: (chain) => ({
            http: chain.rpcUrls.default.http[0],
          }),
        }),
      ],
    )

export const connectors: Connector[] = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    options: {
      projectId: config.walletConnectProjectId,
    },
  }),
]
