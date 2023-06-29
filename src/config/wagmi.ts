import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { mainnet, configureChains, sepolia } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import config from './index'

type Connector = MetaMaskConnector | WalletConnectConnector
const chainArray = config.alchemyChain === 'sepolia' ? sepolia : mainnet
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chainArray],
  [
    alchemyProvider({ apiKey: config.alchemyApiKey }),
    // infuraProvider({ infuraId: config.infuraId, weight: 2 }),
    // publicProvider({ weight: 3 }),
  ],
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
