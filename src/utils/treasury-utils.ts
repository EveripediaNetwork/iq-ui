import { tokenIds } from '@/data/treasury-data'
import { numFormatter } from '@/utils/dashboard-utils'
import { Dict } from '@chakra-ui/utils'

export const fetchTokens = async () => {
  const tokens = tokenIds.map(
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
    dollar_amount: numFormatter(d.current_price.usd * d.circulating_supply),
    percentage: ((d.circulating_supply / d.total_supply) * 100).toFixed(2),
  }))

  const dataObj = data.reduce(
    (acc, nxt) => ({ ...acc, [nxt.id]: nxt }),
    {} as Partial<Record<string, typeof data[number]>>,
  )
  return dataObj
}
