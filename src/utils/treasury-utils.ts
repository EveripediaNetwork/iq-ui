import config from '@/config'
import { fraxLendQueryObject, TokensType } from '@/data/treasury-data'
import {
  ContractDetailsType,
  TreasuryTokenType,
} from '@/types/TreasuryTokenType'
import axios from 'axios'
import { calculateAPR } from './LockOverviewUtils'

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
]

const PROTOCOLS = ['fraxlend', 'convex', 'frax']

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
  const excludedSymbols = ['FraxlendV1 - CRV/FRAX', 'stkCvxFxs', 'stkCvxFpis']
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
  const tokens: ContractDetailsType[] = await fetchEndpointData(
    { walletAddress: config.treasuryAddress as string },
    '/api/fetch-tokens',
  )
  const protocolDetailsPayload = {
    protocolId: 'apestake',
    id: config.treasuryAddress as string,
  }
  const walletDetails = PROTOCOLS.map(async (protocol) => {
    const payload = getTreasuryPayload(protocol)
    const result = await fetchEndpointData(payload, '/api/protocols')
    return result?.portfolio_item_list
  })

  const contractProtocoldetails: ContractDetailsType = (
    await fetchEndpointData(protocolDetailsPayload, '/api/protocols')
  )?.portfolio_item_list[0]?.asset_token_list[0]

  const details = tokens?.map(async (token) => {
    let value = token?.amount
    if (token?.protocol_id === contractProtocoldetails?.protocol_id) {
      value += contractProtocoldetails?.amount
    }
    const dollarValue = token.price * value
    return {
      id: token.symbol,
      contractAddress: token.id,
      token: value,
      raw_dollar: dollarValue,
      logo: token.logo_url,
    }
  })

  const treasuryDetails = await Promise.all(details)
  const additionalTreasuryData: TreasuryTokenType[] = []
  const allLpTokens = await Promise.all(walletDetails)
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
  const allTreasureDetails = [...treasuryDetails, ...additionalTreasuryData]

  return allTreasureDetails
}

export const SortAndSumTokensValue = async (
  treasuryDetails: TreasuryTokenType[],
) => {
  try {
    const excludedSymbols = [
      'FraxlendV1 - CRV/FRAX',
      'stkCvxFxs',
      'stkCvxFpis',
      'FraxlendV1 - FXS/FRAX',
    ]
    const sortedTreasuryDetails = treasuryDetails.sort(
      (a, b) => b.raw_dollar - a.raw_dollar,
    )
    let totalAccountValue = 0
    const filteredSortedDetails = sortedTreasuryDetails.filter(
      (token) =>
        token.raw_dollar > TOKEN_MINIMUM_VALUE &&
        !excludedSymbols.includes(token.id),
    )

    filteredSortedDetails.forEach((token) => {
      if (token.raw_dollar > TOKEN_MINIMUM_VALUE) {
        totalAccountValue += token.raw_dollar
      }
    })

    return { totalAccountValue, sortedTreasuryDetails: filteredSortedDetails }
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

export const calculateYield = async (
  token: TreasuryTokenType,
  totalHiiqSupply: number,
) => {
  if (typeof token.token === 'number' && token.id === 'sfrxETH') {
    const frxEthApr = await fetchSfrxETHApr()
    return frxEthApr
  }
  if (typeof token.token !== 'number' && token.id === 'frax_lending') {
    const fraxLendApr = await fetchFraxPairApr('frax_lending')
    return fraxLendApr
  }
  if (typeof token.token !== 'number' && token.id === 'convex_cvxfxs_staked') {
    //TODO: Use convex contracts for on chain APR calculation
    return null
  }
  if (token.id === 'HiIQ') {
    return calculateAPR(totalHiiqSupply, 0, 4)
  }
  return 0
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
