import config from '@/config'
import { TokensType } from '@/data/treasury-data'
import {
  ContractDetailsType,
  TreasuryTokenType,
} from '@/types/TreasuryTokenType'
import axios from 'axios'
import { calculateAPR } from './LockOverviewUtils'
import { fraxLendQueryObject } from '@/services/treasury/queries'
import { store } from '@/store/store'
import {
  getProtocolDetails,
  getWalletTokens,
} from '@/services/treasury/restApi'

const TOKEN_MINIMUM_VALUE = 4000

const SUPPORTED_LP_TOKENS_ADDRESSES = [
  '0x7af00cf8d3a8a75210a5ed74f2254e2ec43b5b5b',
  '0x41a5881c17185383e19df6fa4ec158a6f4851a69:32',
  '0x3835a58ca93cdb5f912519ad366826ac9a752510',
  '0x49b4d1df40442f0c31b1bbaea3ede7c38e37e31a',
  '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  '0xdbe88dbac39263c47629ebba02b3ef4cf0752a72',
  //newly added lp
  '0xa1d100a5bf6bfd2736837c97248853d989a9ed84',
  '0xbf7b90683fd7e64dbf624809d49bdcb20f09e560',
  '0x41a5881c17185383e19df6fa4ec158a6f4851a69:48',
  '0x41a5881c17185383e19df6fa4ec158a6f4851a69:68',
  '0x41a5881c17185383e19df6fa4ec158a6f4851a69:69',
  '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  '0x39053d51b77dc0d36036fc1fcc8cb819df8ef37a',
  '0x8ca7a5d6f3acd3a7a8bc468a8cd0fb14b6bd28b6',
]

const FRAXTAL_TOKENS = [
  '0xfc00000000000000000000000000000000000008',
  '0x8c279f6bfa31c47f29e5d05a68796f2a6c216892',
  '0x124189d975bd59f85a0be1845b556d9249096522',
  '0x1872621050cc3c267c1982c6d199b7d6a4d0e87a',
  '0x22c4649ea0937e86ab64366ddfb39d6769874b17',
  '0x331b9182088e2a7d6d3fe4742aba1fb231aecc56',
  '0x8c279f6bfa31c47f29e5d05a68796f2a6c216892',
  '0xab4b7c5c9a7c8ebb97877085a6c3550ad4ed3f97',
  '0xed634f2dd6632d0eb017d44639ae77798a315c0f',
  '0xfc00000000000000000000000000000000000002',
  '0xfc00000000000000000000000000000000000008',
]

const PROTOCOLS = ['fraxlend', 'convex', 'frax', 'eigenlayer']

export const fetchEndpointData = async (
  payload: {
    [key: string]: string
  },
  endpointUrl: string,
) => {
  try {
    const result = await axios.get(endpointUrl, {
      params: { ...payload },
    })
    return result.data.response
  } catch (err) {
    console.log(err)
  }
  return undefined
}

export const filterContracts = (
  tokens: TokensType,
  contractBalances: ContractDetailsType[],
): ContractDetailsType[] => {
  const excludedSymbols = ['FraxlendV1 - CRV/FRAX', 'stkCvxFpis']
  const tokenAddresses = Object.values(tokens).map((value) => value.address)

  const filteredResult = contractBalances.filter((contractDetails) => {
    return (
      tokenAddresses.includes(contractDetails.id) &&
      !excludedSymbols.includes(contractDetails.symbol)
    )
  })

  return filteredResult
}

const getTreasuryPayload = (protocol: string) => {
  return {
    protocolId: protocol,
    id: config.treasuryAddress as string,
  }
}

export const getTreasuryDetails = async () => {
  const [
    { data: tokens },
    { data: fraxtalTokens },
    { data: fraxConvexDetails },
  ] = await Promise.all([
    store.dispatch(getWalletTokens.initiate(config.treasuryAddress as string)),
    store.dispatch(
      getWalletTokens.initiate(config.fraxtalTreasuryAddress as string),
    ),
    store.dispatch(
      getProtocolDetails.initiate({
        protocolId: 'frax_convex',
        id: '0x5493f3dbe06accd1f51568213de839498a2a3b83',
      }),
    ),
  ])

  const { data: protocolDetails } = await store.dispatch(
    getProtocolDetails.initiate({
      protocolId: 'apestake',
      id: config.treasuryAddress as string,
    }),
  )

  const walletDetails = await Promise.all(
    PROTOCOLS.map((protocol) => {
      return store.dispatch(
        getProtocolDetails.initiate(getTreasuryPayload(protocol)),
      )
    }),
  )

  const contractProtocoldetails: ContractDetailsType =
    protocolDetails[0]?.asset_token_list[0]
  const treasuryDetails = [...(tokens || []), ...(fraxtalTokens || [])]?.map(
    (token) => {
      let value = token?.amount
      if (token?.protocol_id === contractProtocoldetails?.protocol_id) {
        value += contractProtocoldetails?.amount
      }

      const dollarValue = token.price * value
      const tokenDetails = {
        id: FRAXTAL_TOKENS.includes(token.id)
          ? `${token.symbol} FXTL`
          : token.symbol,
        contractAddress: token.id,
        token: value,
        raw_dollar: dollarValue,
        logo: token.logo_url,
      }

      return tokenDetails
    },
  )

  const additionalTreasuryData: TreasuryTokenType[] = []
  const allLpTokens = walletDetails.map(({ data }) => data)
  allLpTokens.flat().forEach((lp) => {
    if (SUPPORTED_LP_TOKENS_ADDRESSES.includes(lp.pool.id)) {
      additionalTreasuryData.push({
        id: lp.pool.adapter_id,
        contractAddress: lp.pool.controller,
        raw_dollar: Number(lp.stats.asset_usd_value),
        token: lp.detail.supply_token_list.map(
          (supply: { amount: number; symbol: string }) => ({
            amount: supply.amount,
            symbol: supply.symbol,
          }),
        ),
      })
    }
  })

  // Add Frax Convex holdings
  if (fraxConvexDetails) {
    console.log(fraxConvexDetails)
    fraxConvexDetails.forEach(
      (item: {
        pool: { adapter_id: any; controller: any; id: any }
        stats: { asset_usd_value: any }
        detail: { supply_token_list: { amount: number; symbol: string }[] }
      }) => {
        additionalTreasuryData.push({
          id: item.pool.id,
          contractAddress: item.pool.id,
          raw_dollar: Number(item.stats.asset_usd_value),
          token: item.detail.supply_token_list.map(
            (supply: { amount: number; symbol: string }) => ({
              amount: supply.amount,
              symbol: supply.symbol,
            }),
          ),
        })
      },
    )
  }

  const allTreasureDetails = [...treasuryDetails, ...additionalTreasuryData]

  return allTreasureDetails
}

export const SortAndSumTokensValue = (treasuryDetails: TreasuryTokenType[]) => {
  try {
    const excludedSymbols = [
      'FraxlendV1 - CRV/FRAX',
      'stkCvxFpis',
      'FraxlendV1 - FXS/FRAX',
    ]

    const validTokens = treasuryDetails.filter((token) => {
      return (
        token.raw_dollar > TOKEN_MINIMUM_VALUE &&
        !excludedSymbols.includes(token.id)
      )
    })

    const sortedTreasuryDetails = validTokens.sort(
      (a, b) => b.raw_dollar - a.raw_dollar,
    )

    const totalAccountValue = sortedTreasuryDetails.reduce(
      (acc, token) => acc + token.raw_dollar,
      0,
    )

    return { totalAccountValue, sortedTreasuryDetails }
  } catch (err) {
    console.log(err)
    return { totalAccountValue: 0, sortedTreasuryDetails: [] }
  }
}
export const calculateInvestmentYield = (
  value: number,
  apr: number,
  lockPeriod: number,
) => {
  if (apr === 0) return 0
  const dailyApr = apr / lockPeriod / 365
  const dailyYield = (value * dailyApr) / 100 // 100 is to convert apr to percentage
  const percentageYield = (dailyYield / value) * 100
  return percentageYield
}

export const calculateYield = (
  token: TreasuryTokenType,
  totalHiiqSupply: number,
  fraxEthSummary: number | undefined,
  fraxAprData: number | undefined,
) => {
  switch (token.id) {
    case 'sfrxETH':
      return fraxEthSummary ? fraxEthSummary : 0
    case 'frax_lending':
      return fraxAprData ? fraxAprData : 0
    case 'convex_cvxfxs_staked':
      return undefined
    case 'HiIQ':
      return calculateAPR(totalHiiqSupply, 0, 4)
    default:
      return 0
  }
}

export const fetchSfrxETHApr = async () => {
  try {
    const result = await axios.get(
      'https://api.frax.finance/v2/frxeth/summary/latest',
    )
    return result.data.sfrxethApr
  } catch (err) {
    console.log(err)
    return 0
  }
}

const returnTokenIndexFromFrax = (token: string) => {
  if (token === 'cvxFXS') {
    return 15
  }
  return 20
}
export const fetchFraxPairApr = async (tokenName: string) => {
  try {
    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/frax-finance-data/fraxlend-subgraph---mainnet',
      {
        headers: {
          accept: '*/*',
          'accept-language':
            'en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4',
          'content-type': 'application/json',
        },
        body: JSON.stringify(fraxLendQueryObject),
        method: 'POST',
      },
    )
    const result = await response.json()
    const NUMBER_OF_SECONDS = 365 * 24 * 3600
    const utilizationRate =
      Number(
        result.data.pairs[returnTokenIndexFromFrax(tokenName)].dailyHistory[0]
          ?.utilization,
      ) / 100_000
    const interestPerSecond =
      Number(
        result.data.pairs[returnTokenIndexFromFrax(tokenName)].dailyHistory[0]
          ?.interestPerSecond,
      ) /
      10 ** 18
    const apr = interestPerSecond * NUMBER_OF_SECONDS * utilizationRate * 100
    return apr
  } catch (err) {
    console.log(err)
    return 0
  }
}
