import { Dict } from '@chakra-ui/utils'

const everipediaBaseApiEndpoint = 'https'
// TODO: get apis for hardcoded values
const eosVolume = 10019699034
const twitterFollowers = 118300
const maticHolders = 1568
const bscHolders = 802

type FraxswapLiquidityData = {
  tokens: {
    tokenInfo: {
      price: {
        rate: number
        availableSupply: number
      }
    }
  }[]
}

const calculateFraxSwapLiquidity = (data: FraxswapLiquidityData) => {
  const totalLiquidty: number = data?.tokens?.reduce((acc: number, token) => {
    return (
      acc + token.tokenInfo.price.availableSupply * token.tokenInfo.price.rate
    )
  }, 0)

  return totalLiquidty
}

const getLockBreakdown = async () => {
  const response = await fetch(
    `${everipediaBaseApiEndpoint}/iq/hiiq/lock-summary`,
  )
  return response.json()
}

const getUserBalances = async () => {
  const formatYmd = (date: Date) => date.toISOString().slice(0, 10)

  const d = formatYmd(new Date())
  const response = await fetch(
    `${everipediaBaseApiEndpoint}/iq/hiiq/user-balances?start=${d}&end=${d}`,
  )

  return response.json()
}

const getTokenHolders = async () => {
  const response = await fetch(
    'https://www.api.bloks.io/tokens?type=tokenHoldersCount&chain=eos&contract=everipediaiq&symbol=IQ',
  )
  const data = await response.text()

  const response2 = await fetch(
    'https://ethplorer.io/service/service.php?data=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  )
  const data2 = await response2.json()
  return {
    holders: {
      eos: data,
      eth: data2.token.holdersCount,
      matic: maticHolders,
      bsc: bscHolders,
    },
  }
}

const getVolume = async () => {
  const response = await fetch(
    'https://ethplorer.io/service/service.php?data=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9&page=pageSize%3D900%26pageTab%3Dholders',
  )
  const data = await response.json()
  const ethVolume = data.token.totalSupply
  const maticVolume = data.holders.find(
    (h: Dict) => h.address === '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf',
  )
  const bscVolume = data.holders.find(
    (h: Dict) => h.address === '0x533e3c0e6b48010873b947bddc4721b1bdff9648',
  )

  const maticBalance = maticVolume?.balance ?? 0
  const bscBalance = bscVolume?.balance ?? 0

  return {
    volume: {
      eos: eosVolume - ethVolume / 10e17,
      eth: (ethVolume - maticBalance - bscBalance) / 10e17,
      matic: maticBalance / 10e17,
      bsc: bscBalance / 10e17,
    },
  }
}

const getHiIQ = async () => {
  const response = await fetch(
    'https://ethplorer.io/service/service.php?data=0x1bf5457ecaa14ff63cc89efd560e251e814e16ba&page=pageSize%3D600%26pageTab%3Dholders%26tab%3Dtab-holders&showTx=all',
  )
  const data = await response.json()

  const response2 = await fetch(
    'https://api.ethplorer.io/getAddressInfo/0x1bf5457ecaa14ff63cc89efd560e251e814e16ba?apiKey=freekey',
  )
  const data2 = await response2.json()

  return {
    hiiq: {
      holders: data.pager?.holders?.total || data.token?.holdersCount || 0,
      volume: parseInt(data.token?.totalSupply, 10) / 10e17 || 0,
      locked: parseInt(data2.tokens[0].rawBalance, 10) / 10e17 || 0,
    },
  }
}

const getLPs = async () => {
  const response = await fetch(
    'https://api.ethplorer.io/getAddressInfo/0x07af6bb51d6ad0cf126e3ed2dee6eac34bf094f8?apiKey=freekey',
  )
  const data = await response.json()

  const response2 = await fetch(
    'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
    {
      headers: {
        accept: '*/*',
        'accept-language':
          'en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4',
        'content-type': 'application/json',
      },
      body: '{"operationName":"pairs","variables":{"allPairs":["0x81ac2e2fa514e9e765267940cae269040b48ad6e"]},"query":"fragment PairFields on Pair {\\n  id\\n  token0 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  token1 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  reserve0\\n  reserve1\\n  reserveUSD\\n  totalSupply\\n  trackedReserveETH\\n  reserveETH\\n  volumeUSD\\n  untrackedVolumeUSD\\n  token0Price\\n  token1Price\\n  createdAtTimestamp\\n  __typename\\n}\\n\\nquery pairs($allPairs: [Bytes]!) {\\n  pairs(first: 500, where: {id_in: $allPairs}, orderBy: trackedReserveETH, orderDirection: desc) {\\n    ...PairFields\\n    __typename\\n  }\\n}\\n"}',
      method: 'POST',
    },
  )
  const data2 = await response2.json()

  const response3 = await fetch(
    'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
    {
      headers: {
        accept: '*/*',
        'accept-language':
          'en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4',
        'content-type': 'application/json',
      },
      body: '{"query":"{\\n  pair(id: \\"0x9d45081706102e7aaddd0973268457527722e274\\") {\\n    reserveUSD\\n  }\\n}","variables":null}',
      method: 'POST',
    },
  )
  const data3 = await response3.json()
  return {
    lp: {
      fraxswap: calculateFraxSwapLiquidity(data),
      quickswap: data2.data && data2.data.pairs[0].reserve0 * 2,
      sushiswap: data3.data?.pair.reserveUSD,
    },
  }
}

const getEpData = async () => {
  const response = await fetch('https://graph.everipedia.org/graphql', {
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        wikisCreated(startDate: 0, interval: "year") {
          amount
        }
      }`,
    }),
    method: 'POST',
  })

  const data = await response.json()

  const response2 = await fetch('https://graph.everipedia.org/graphql', {
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        wikisEdited(startDate: 0, interval: "year") {
          amount
        }
      }`,
    }),
    method: 'POST',
  })

  const data2 = await response2.json()

  return {
    ep: {
      articles: data.data.wikisCreated[0].amount,
      edits: data2.data.wikisEdited[0].amount,
    },
  }
}

const getSocialData = async () => {
  const response = await fetch('https://www.reddit.com/r/everipedia/about.json')
  const data = await response.json()
  return {
    social: {
      twitter: twitterFollowers,
      reddit: data.data.subscribers,
    },
  }
}

export {
  getLockBreakdown,
  getUserBalances,
  getTokenHolders,
  getVolume,
  getEpData,
  getSocialData,
  getHiIQ,
  getLPs,
}
