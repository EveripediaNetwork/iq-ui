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

// export const getPriceDetailsBySymbol = async (symbol: string) => {
//   try {
//     const res = await axios.get('/api/cmc-token-details', {
//       params: { tokenName: symbol },
//     })
//     const response = res.data
//     const { data } = response.response
//     const tokenDetails = data[symbol]
//     return tokenDetails?.quote?.USD?.price
//   } catch (error) {
//     console.log('Error fetching data:', getError(error))
//     return null
//   }
// }
