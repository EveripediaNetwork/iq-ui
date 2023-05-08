import config from '@/config'
import { ethAlchemy, polygonAlchemy } from '@/config/alchemy-sdk'
import { NORMALIZE_VALUE } from '@/data/LockConstants'
import {
  bscHolders,
  ETHPLORER_CONTRACT_ADDRESS,
  ETHPLORER_TOKEN_ADDRESSES,
  maticHolders,
  POLYGON_CONTRACT_ADDRESS,
  POLYGON_TOKEN_ADDRESSES,
  TOKEN_PAIR,
  twitterFollowers,
} from '@/data/StatsData'
import { ContractDetailsType } from '@/types/TreasuryTokenType'
import { Dict } from '@chakra-ui/utils'
import { Alchemy } from 'alchemy-sdk'
import axios from 'axios'
import {
  fetchContractBalances,
  getPriceDetailsBySymbol,
  getTokenMetaData,
} from './alchemyUtils'
import { getError } from './getError'
import { formatContractResult } from './LockOverviewUtils'
import { fetchEndpointData } from './treasury-utils'

const getEosSupplyUsingGreymassAPI = async () => {
  try {
    const response = await axios.post(
      'https://eos.greymass.com/v1/chain/get_table_rows',
      '{"json":true,"code":"everipediaiq","scope":"IQ","table":"stat","index_position":1,"key_type":"","limit":"1"}',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    const result = response.data.rows[0].supply.split(' ')
    return result[0]
  } catch (err) {
    console.log(getError(err))
    return 0
  }
}
const getEosSupply = async () => {
  try {
    const response = await fetch(
      'https://www.api.bloks.io/tokens/IQ-eos-everipediaiq',
    )
    const result = await response.json()
    const iqSupply = result[0].supply.circulating
    if (iqSupply > 0) return iqSupply
    return await getEosSupplyUsingGreymassAPI()
  } catch (_err) {
    return await getEosSupplyUsingGreymassAPI()
  }
}

const calculateLPBalance = async (
  alchemyInstance: Alchemy,
  contractAddress: string,
  tokenAddresses: string[],
) => {
  const balances = await fetchContractBalances(
    alchemyInstance,
    contractAddress,
    tokenAddresses,
  )
  const convertedBalances = balances.tokenBalances.map(async (token) => {
    const value = formatContractResult(token.tokenBalance as string)
    const tokenMetaData = await getTokenMetaData(
      alchemyInstance,
      token.contractAddress,
    )
    const price = await getPriceDetailsBySymbol(
      TOKEN_PAIR[tokenMetaData?.symbol as string],
    )
    const lpBalance = price * value
    return {
      lpBalance,
    }
  })
  const response = await Promise.all(convertedBalances)
  let totalAccountValue = 0
  response.forEach((token) => {
    totalAccountValue += token.lpBalance
  })
  return totalAccountValue
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
  // TODO: get https://www.bloks.io/account/xeth.ptokens balance and remove it to eosVolume
  return {
    volume: {
      eos: await getEosSupply(),
      eth: (ethVolume - maticBalance - bscBalance) / NORMALIZE_VALUE,
      matic: maticBalance / NORMALIZE_VALUE,
      bsc: bscBalance / NORMALIZE_VALUE,
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
      volume: parseInt(data.token?.totalSupply, 10) / NORMALIZE_VALUE || 0,
      locked: parseInt(data2.tokens[0].rawBalance, 10) / NORMALIZE_VALUE || 0,
    },
  }
}

const getLPs = async () => {
  const response2 = await fetch(
    'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06',
    {
      headers: {
        accept: '*/*',
        'accept-language':
          'en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4',
        'content-type': 'application/json',
      },
      body: '{"operationName":"pairs","variables":{"allPairs":["0x9f4360a2390321cb1cbff4cebeb4315d64ed3ac1"]},"query":"fragment PairFields on Pair {\\n  id\\n  token0 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  token1 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  reserve0\\n  reserve1\\n  reserveUSD\\n  totalSupply\\n  trackedReserveETH\\n  reserveETH\\n  volumeUSD\\n  untrackedVolumeUSD\\n  token0Price\\n  token1Price\\n  createdAtTimestamp\\n  __typename\\n}\\n\\nquery pairs($allPairs: [Bytes]!) {\\n  pairs(first: 500, where: {id_in: $allPairs}, orderBy: trackedReserveETH, orderDirection: desc) {\\n    ...PairFields\\n    __typename\\n  }\\n}\\n"}',
      method: 'POST',
    },
  )
  const data2 = await response2.json()

  const fraxSwap = await calculateLPBalance(
    ethAlchemy,
    ETHPLORER_CONTRACT_ADDRESS,
    ETHPLORER_TOKEN_ADDRESSES,
  )

  const polygonSwap = await calculateLPBalance(
    polygonAlchemy,
    POLYGON_CONTRACT_ADDRESS,
    POLYGON_TOKEN_ADDRESSES,
  )

  const sushiSwapPayload = {
    protocolId: 'sushiswap',
    id: config.treasuryAddress as string,
  }
  const sushiSwap: ContractDetailsType = (
    await fetchEndpointData(sushiSwapPayload, '/api/protocols')
  ).portfolio_item_list[0].stats.asset_usd_value

  return {
    lp: {
      fraxSwap,
      quickSwap: data2.data && data2.data.pairs[0].reserve0 * 2,
      polygonSwap,
      sushiSwap,
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

  const addCountAMount = (dataArray: any[]) => {
    let total = 0
    dataArray.map((item) => {
      total += item.amount
      return total
    })
    return total
  }

  return {
    ep: {
      articles: addCountAMount(data.data.wikisCreated),
      edits: addCountAMount(data2.data.wikisEdited),
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

export { getTokenHolders, getVolume, getEpData, getSocialData, getHiIQ, getLPs }
