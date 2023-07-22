import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { mainnet } from 'wagmi'
import { configureChains } from '@wagmi/core'
import { sepolia } from 'wagmi/chains'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'

import config from './index'

type Connector = MetaMaskConnector | WalletConnectConnector

const chainArray = config.alchemyChain === 'sepolia' ? sepolia : mainnet

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chainArray],
  [alchemyProvider({ apiKey: config.alchemyApiKey }), publicProvider()],
)
export const connectors: Connector[] = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    options: {
      projectId: config.walletConnectProjectId,
    },
  }),
]
