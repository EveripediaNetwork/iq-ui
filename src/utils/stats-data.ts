import config from '@/config'
import { ethAlchemy } from '@/config/alchemy-sdk'
import { NORMALIZE_VALUE } from '@/data/LockConstants'
import {
  bscHolders,
  ETHPLORER_CONTRACT_ADDRESS,
  ETHPLORER_TOKEN_ADDRESSES,
  maticHolders,
} from '@/data/StatsData'
import { Alchemy } from 'alchemy-sdk'
import axios from 'axios'
import { fetchContractBalances, getTokenMetaData } from './alchemyUtils'
import { fetchTokenData } from './dashboard-utils'
import { getError } from './getError'
import { fetchEndpointData } from './treasury-utils'
import { formatEther, formatUnits } from 'viem'
import { getTokenBalance } from '@/utils/getTokenBalance'
import { readContract } from '@wagmi/core'
import hiIQABI from '@/abis/hiIQABI.abi'
import IQABI from '@/abis/IQABI.abi'
import { useGetHIIQHoldersCountQuery } from '@/services/holders'
import { store } from '@/store/store'
import { getProtocolDetails } from '@/services/treasury/restApi'

const CURVE_LIQUIDITY_POOL_ADDRESS =
  '0xfb8b95fb2296a0ad4b6b1419fdaa5aa5f13e4009'
const BAMM_WALLET_ADDRESS = '0xc0780420d79e1eef7a597b3af6663d79bdbf13ae'
const BAMM_FRAXSWAP_POOL_ADDRESS = '0xdf1c16eabc74afe18ddc81f2e0b0cf16582d92a8'

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
  try {
    const balances = await fetchContractBalances(
      alchemyInstance,
      contractAddress,
      tokenAddresses,
    )
    const convertedBalances = balances.tokenBalances.map(async (token) => {
      const value = Number(formatEther(BigInt(token?.tokenBalance ?? 0n)))
      const tokenMetaData = await getTokenMetaData(
        alchemyInstance,
        token.contractAddress,
      )
      const tokenData = await fetchTokenData(tokenMetaData?.symbol as string)
      const lpBalance = tokenData?.price * value
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
  } catch (err) {
    console.log(getError(err))
    return 0
  }
}

const getTokenHolders = async () => {
  const { data: count } = useGetHIIQHoldersCountQuery()
  console.log(count)
  try {
    console.log(count)
    const eosDataresponse = await fetch(
      'https://www.api.bloks.io/tokens?type=tokenHoldersCount&chain=eos&contract=everipediaiq&symbol=IQ',
    )
    const eosData = await eosDataresponse.text()
    const ethDataResponse = await fetch(
      '/api/token-holder-count?address=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
    )
    const ethData = await ethDataResponse.json()

    const hiiqDataResponse = await fetch(
      '/api/token-holder-count?address=0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba',
    )
    const hiiqData = await hiiqDataResponse.json()
    console.log(hiiqData)
    return {
      holders: {
        eos: eosData,
        eth: ethData?.response ?? 0,
        matic: maticHolders,
        bsc: bscHolders,
        hiiq: hiiqData ?? 0,
      },
    }
  } catch (err) {
    console.log(getError(err))
    return {
      holders: {
        eos: 0,
        eth: 0,
        matic: 0,
        bsc: 0,
        hiiq: 0,
      },
    }
  }
}

const getTotalSupply = async (token: 'IQ' | 'hiIQ') => {
  switch (token) {
    case 'IQ':
      return await readContract({
        address: config.iqAddress as `0x${string}`,
        abi: IQABI,
        functionName: 'totalSupply',
      })
    case 'hiIQ':
      return await readContract({
        address: config.hiiqAddress as `0x${string}`,
        abi: hiIQABI,
        functionName: 'totalSupply',
      })
  }
}

const getVolume = async () => {
  try {
    const ethDataResponse = await getTotalSupply('IQ')
    const ethDataFormatted = ethDataResponse
      ? BigInt(ethDataResponse?.toString())
      : BigInt(0)
    const ethVolume = Number(formatUnits(ethDataFormatted, 18))
    const maticBalance = await getTokenBalance(
      'IQ',
      '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf',
    )
    const bscBalance = await getTokenBalance(
      'IQ',
      '0x533e3c0e6b48010873b947bddc4721b1bdff9648',
    )
    const hiiqDataResponse = await getTotalSupply('hiIQ')
    const hiiqDataFormatted = hiiqDataResponse
      ? BigInt(hiiqDataResponse?.toString())
      : BigInt(0)
    const hiiqData = Number(formatUnits(hiiqDataFormatted, 18))
    // TODO: get https://www.bloks.io/account/xeth.ptokens balance and remove it to eosVolume
    return {
      volume: {
        eos: await getEosSupply(),
        eth: ethVolume - maticBalance - bscBalance,
        matic: maticBalance,
        bsc: bscBalance,
        hiiq: hiiqData,
      },
    }
  } catch (err) {
    console.log(getError(err))
    return {
      volume: {
        eos: 0,
        eth: 0,
        matic: 0,
        bsc: 0,
        hiiq: 0,
      },
    }
  }
}

const getIQ = async () => {
  try {
    const response = await fetch(
      `https://api.ethplorer.io/getAddressInfo/0x1bf5457ecaa14ff63cc89efd560e251e814e16ba?apiKey=${config.ethplorerApiKey}`,
    )
    const data = await response.json()
    const data2 = await fetchTokenData('IQ')
    return {
      Iq: {
        locked: parseInt(data.tokens[0].rawBalance, 10) / NORMALIZE_VALUE || 0,
        mcap: data2?.marketCap,
        volume: data2?.volume,
      },
    }
  } catch (err) {
    console.log(getError(err))
    return {
      Iq: {
        locked: 0,
        mcap: 0,
        volume: 0,
      },
    }
  }
}

const _getFraxConvexData = async (assetTokenLength: number) => {
  const { data } = await store.dispatch(
    getProtocolDetails.initiate({
      protocolId: 'frax_convex',
      id: '0x5493f3dbe06accd1f51568213de839498a2a3b83',
    }),
  )
  return data
    .filter((item: any) => item.asset_token_list.length > assetTokenLength)
    .reduce((total: number, item: any) => total + item.stats.asset_usd_value, 0)
}

const getSushiSwapData = async () => {
  const data = await fetchEndpointData(
    { protocolId: 'sushiswap', id: config.treasuryAddress as string },
    '/api/protocols',
  )
  return data.portfolio_item_list[0].stats.asset_usd_value
}

const getCurveFraxtalData = async () => {
  const data = await fetchEndpointData(
    {
      chainId: 'frax',
      id: CURVE_LIQUIDITY_POOL_ADDRESS,
    },
    '/api/liquidity-pool',
  )

  return data?.stats.deposit_usd_value || 0
}

const getBAMMFraxswapPoolData = async () => {
  const data = await fetchEndpointData(
    {
      chainId: 'frax',
      id: BAMM_FRAXSWAP_POOL_ADDRESS,
    },
    '/api/liquidity-pool',
  )

  return data?.stats.deposit_usd_value || 0
}

const getBAMMTotalChainBalance = async () => {
  const data = await fetchEndpointData(
    {
      chainId: 'frax',
      id: BAMM_WALLET_ADDRESS,
    },
    '/api/chain-balance',
  )

  return data?.usd_value || 0
}

const getLPs = async () => {
  const fetchData = async (promise: Promise<any>) => {
    try {
      return await promise
    } catch (error) {
      console.log(getError(error))
      return 0
    }
  }

  const promises = [
    calculateLPBalance(
      ethAlchemy,
      ETHPLORER_CONTRACT_ADDRESS,
      ETHPLORER_TOKEN_ADDRESSES,
    ),
    fetchData(getSushiSwapData()),
    fetchData(getCurveFraxtalData()),
    fetchData(getBAMMTotalChainBalance()),
    fetchData(getBAMMFraxswapPoolData()),
  ]

  const [
    fraxSwap,
    sushiSwap,
    curveFraxtal,
    bammTotalChainBalance,
    bammFraxswapLiquidity,
  ] = await Promise.all(promises.map(fetchData))
  const bammLiquidity = bammTotalChainBalance - bammFraxswapLiquidity

  return {
    lp: {
      fraxSwap,
      bammLiquidity,
      sushiSwap,
      curveFraxtal,
    },
  }
}

const getEpData = async () => {
  try {
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

    const wikiDataresponse = await fetch(
      'https://graph.everipedia.org/graphql',
      {
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
      },
    )

    const wikiData = await wikiDataresponse.json()

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
        edits: addCountAMount(wikiData.data.wikisEdited),
      },
    }
  } catch (err) {
    console.log(getError(err))
    return {
      ep: {
        articles: 0,
        edits: 0,
      },
    }
  }
}

const getSocialData = async () => {
  try {
    const redditResponse = await fetch(
      'https://www.reddit.com/r/everipedia/about.json',
    )
    const twitterResponse = await fetch('/api/social-data')
    const { twitterFollowers } = await twitterResponse.json()
    const redditData = await redditResponse.json()
    return {
      social: {
        twitter: twitterFollowers,
        reddit: redditData.data.subscribers,
      },
    }
  } catch (err) {
    console.log(getError(err))
    return {
      social: {
        twitter: 0,
        reddit: 0,
      },
    }
  }
}

export { getTokenHolders, getVolume, getEpData, getSocialData, getIQ, getLPs }
