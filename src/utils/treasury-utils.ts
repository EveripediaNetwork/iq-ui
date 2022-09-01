import { tokenNetworks } from '@/data/treasury-data'
import { numFormatter } from '@/utils/dashboard-utils'
import { provider } from '@/utils/getProvider'
import { Dict } from '@chakra-ui/utils'
import { BaseContract, Contract } from 'ethers'

export const fetchTokens = async () => {
  const tokens = tokenNetworks.map(
    d => `https://api.coingecko.com/api/v3/coins/${d}`,
  )

  const tokensData = tokens.map(async url => {
    const preFetchData = await fetch(url)
    return preFetchData.json()
  })

  const response = await Promise.all(tokensData)
  return response
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

export const fetchLPTokens = async () => {
  const abi = [
    'function totalSupply() view returns (uint256)',
    'function getReserves() view returns (uint112 _reserve0, uint112 _reserve1, uin32 _blockTimestampLast)',
  ]

  const ADDRESS = '0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba'

  const lpContract = new Contract(
    ADDRESS,
    abi,
    provider as unknown as BaseContract['provider'],
  )

  const totalSupply = await lpContract.totalSupply()
  console.log('totalSupply', totalSupply)
  // const reserves = lpContract.getReserves()

  // const totalSupplyFormatted = numFormatter(totalSupply)
  // const reservesFormatted = [
  //   numFormatter(reserves._reserve0),
  //   numFormatter(reserves._reserve1),
  // ]

  // const lpTokensData = {
  //   totalSupply: totalSupplyFormatted,
  //   reserves: reservesFormatted,
  // }
}

export const transformLpTokensData = (tokensData: Dict[]) => {
  const dataObj = {}
  return dataObj
}
