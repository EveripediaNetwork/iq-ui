import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { chain, configureChains } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import config from './index'

type Connector = MetaMaskConnector | WalletConnectConnector
const chainArray =
  config.alchemyChain === 'matic' ? [chain.polygon] : [chain.polygonMumbai]
export const { chains, provider } = configureChains(chainArray, [
  alchemyProvider({ alchemyId: config.alchemyApiKey, weight: 1 }),
  infuraProvider({ infuraId: config.infuraId, weight: 2 }),
  publicProvider({ weight: 3 }),
])

export const connectors: Connector[] = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
]
