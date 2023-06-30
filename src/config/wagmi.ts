import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { mainnet, configureChains } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import config from './index'

type Connector = MetaMaskConnector | WalletConnectConnector

const chainArray = config.alchemyChain === 'goerli' ? goerli : mainnet

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chainArray],
  [alchemyProvider({ apiKey: config.alchemyApiKey }), publicProvider()],
)

export const connectors: Connector[] = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: config.walletConnectProjectId,
    },
  }),
]
