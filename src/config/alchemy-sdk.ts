import { Network, Alchemy } from 'alchemy-sdk'
import config from '.'

const ethNetworkSettings = {
  apiKey: config.alchemyApiKey,
  network: Network.ETH_MAINNET,
}

const polygonNetworkSettings = {
  apiKey: config.alchemyApiKey,
  network: Network.MATIC_MAINNET,
}

export const ethAlchemy = new Alchemy(ethNetworkSettings)
export const polygonAlchemy = new Alchemy(polygonNetworkSettings)
