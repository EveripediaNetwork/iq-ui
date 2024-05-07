import { Alchemy } from 'alchemy-sdk'

export const fetchContractBalances = async (
  alchemyInstance: Alchemy,
  contractAddress: string,
  tokenAddresses: string[],
) => {
  const result = await alchemyInstance.core.getTokenBalances(
    contractAddress,
    tokenAddresses,
  )
  return result
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
