import config from '@/config'
import { ethAlchemy } from '@/config/alchemy-sdk'
import { fetchContractBalances, getTokenDetails, getTokenMetaData, getPriceDetailsBySymbol } from './alchemyUtils'
import { formatContractResult } from './LockOverviewUtils'

const tokenAddresses = [
  '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
  // '0x56398b89d53e8731bca8c1b06886cfb14bd6b654',
   '0x9d45081706102e7aaddd0973268457527722e274',
  // '0x9D45081706102E7aadDD0973268457527722E274',
]

const fetchContractTokens = async () => {
  const address = config.treasuryAddress as string
  const balances = await fetchContractBalances(
    ethAlchemy,
    address,
    tokenAddresses,
  )
  const convertedBalances = balances.tokenBalances.map(async token => {
    const tokenMetaData = await getTokenMetaData(
      ethAlchemy,
      token.contractAddress,
    )
    // const rate = await getPriceDetailsBySymbol(
    //   TOKEN_P[tokenMetaData?.symbol as string],
    // )
    console.log(tokenMetaData)
    const value = formatContractResult(token.tokenBalance as string)
    const convertedTokenDetails = await getTokenDetails(token.contractAddress)
    const price = convertedTokenDetails?.market_data?.current_price?.usd
    const totalSupply = convertedTokenDetails?.market_data
      ?.total_supply as number
    const dollarValue = price * value

    return {
      id: convertedTokenDetails.id as string,
      contractAddress: token.contractAddress,
      token: value,
      price: price as number,
      raw_dollar: dollarValue,
      total_supply: totalSupply,
    }
  })
  const response = await Promise.all(convertedBalances)
  let totalAccountValue = 0
  response.forEach(token => {
    totalAccountValue += token.raw_dollar
  })
  return { totalAccountValue, response }
}

export const fetchTokens = async () => {
  const result = await fetchContractTokens()
  console.log(result)
  return result
}
