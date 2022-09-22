import { Network, Alchemy } from 'alchemy-sdk'
import config from '.'

const settings = {
  apiKey: config.alchemyApiKey, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET, // Replace with your network.
}

export const alchemy = new Alchemy(settings)
