import config from '@/config'
import { alchemy } from '@/config/alchemy-sdk'
import { numFormatter } from '@/utils/dashboard-utils'
import { Dict } from '@chakra-ui/utils'
import { BigNumberish, ethers } from 'ethers'

const tokenAddresses = [
  '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
]
const fetchContractTokens = async () => {
  const address = config.treasuryAddress as string
  const balances = await alchemy.core.getTokenBalances(address, tokenAddresses)
  const convertedBalances = balances.tokenBalances.map(async token => {
    const value = ethers.utils.formatEther(token.tokenBalance as BigNumberish)
    const tokenDetails = await fetch(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${token.contractAddress}`,
    )
    const convertedTokenDetails = await tokenDetails.json()
    const price = convertedTokenDetails?.market_data?.current_price?.usd
    const totalSupply = convertedTokenDetails?.market_data
      ?.total_supply as number
    const dollarValue = price * parseFloat(value)
    return {
      id: convertedTokenDetails.id,
      contractAddress: token.contractAddress,
      token: value,
      price,
      raw_dollar: dollarValue,
      percentage: (parseFloat(value) / totalSupply) * 100,
      total_supply: totalSupply,
    }
  })
  const response = await Promise.all(convertedBalances)
  return response
}

export const fetchTokens = async () => {
  // const tokens = tokenIds.map(
  //   d => `https://api.coingecko.com/api/v3/coins/${d}`,
  // )

  const result = await fetchContractTokens()
  // const tokensData = tokens.map(async url => {
  //   const preFetchData = await fetch(url)
  //   return preFetchData.json()
  // })

  // const response = await Promise.all(tokensData)
  return result
}

export const transformTokensData = (tokensData: Dict[]) => {
  const data = tokensData.map(({ id, market_data: d }) => ({
    id,
    tokens: d.circulating_supply.toFixed(2),
    raw_dollar: d.current_price.usd * d.circulating_supply,
    dollar_amount: numFormatter(d.current_price.usd * d.circulating_supply),
    percentage: ((d.circulating_supply / d.total_supply) * 100).toFixed(2),
  }))

  const dataObj = data.reduce(
    (acc, nxt) => ({ ...acc, [nxt.id]: nxt }),
    {} as Partial<Record<string, typeof data[number]>>,
  )
  return dataObj
}
