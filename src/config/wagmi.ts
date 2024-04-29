// import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
// import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
//TODO: uncomment import { coinbaseWallet, injected } from 'wagmi/connectors'
// import { mainnet, } from 'wagmi'
//TODO uncomment import { mainnet } from 'wagmi/chains'
//TODO: ***Continue wagmi v2 migration and tenderly integration need to replace alchemy provider */
// import { configureChains } from '@wagmi/core'
// import { goerli } from 'wagmi/chains'
// import { alchemyProvider } from '@wagmi/core/providers/alchemy'
// import { publicProvider } from '@wagmi/core/providers/public'

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
    options: {
      projectId: config.walletConnectProjectId,
    },
  }),
]
