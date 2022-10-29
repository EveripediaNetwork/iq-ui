import { Alchemy } from 'alchemy-sdk'

export const fetchContractBalances = async (
  alchemyInstance: Alchemy,
  contractAddress: string,
  tokenAddresses: string[],
) => {
  return alchemyInstance.core.getTokenBalances(contractAddress, tokenAddresses)
}

export const getTokenMetaData = async (
  alchemyInstance: Alchemy,
  contractAddress: string,
) => {
  return alchemyInstance.core.getTokenMetadata(contractAddress)
}

export const getTokenDetails = async (contractAddress: string) => {
  const tokenDetails = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`,
  )
  return tokenDetails.json()
}

export const getPriceDetailsBySymbol = async (symbol: string) => {
  const tokenDetails = await fetch(
    `https://api.coingecko.com/api/v3/coins/${symbol}`,
  )
  const result = await tokenDetails.json()
  return result?.market_data?.current_price?.usd
}
