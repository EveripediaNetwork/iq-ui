import { Alchemy } from 'alchemy-sdk'

export const fetchContractBalances = async (
  alchemyInstance: Alchemy,
  contractAddress: string,
  tokenAddresses: string[],
) => {
  return alchemyInstance.core.getTokenBalances(contractAddress, tokenAddresses)
}

export const getTokenDetails = async (contractAddress: string) => {
  const tokenDetails = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`,
  )
  return tokenDetails.json()
}
