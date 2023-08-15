import config from '@/config'
import { chain, TOKENS, TokensType } from '@/data/treasury-data'
import {
  ContractDetailsType,
  TreasuryTokenType,
} from '@/types/TreasuryTokenType'
import axios from 'axios'

const SUPPORTED_LP_TOKENS_ADDRESSES = [
  '0x7af00cf8d3a8a75210a5ed74f2254e2ec43b5b5b',
  '0x41a5881c17185383e19df6fa4ec158a6f4851a69:32',
  '0x3835a58ca93cdb5f912519ad366826ac9a752510',
  '0x49b4d1df40442f0c31b1bbaea3ede7c38e37e31a',
  '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  '0xdbe88dbac39263c47629ebba02b3ef4cf0752a72',
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
  const contractDetailsPayload = {
    walletAddress: config.treasuryAddress as string,
    chain: chain.Eth,
  }
  const protocolDetailsPayload = {
    protocolId: 'apestake',
    id: config.treasuryAddress as string,
  }
  const walletDetails = PROTOCOLS.map(async (protocol) => {
    const payload = getTreasuryPayload(protocol)
    const result = await fetchEndpointData(payload, '/api/protocols')
    return result.portfolio_item_list
  })
  const contractdetails: ContractDetailsType[] = await fetchEndpointData(
    contractDetailsPayload,
    '/api/token-details',
  )
  const contractProtocoldetails: ContractDetailsType = (
    await fetchEndpointData(protocolDetailsPayload, '/api/protocols')
  ).portfolio_item_list[0].asset_token_list[0]
  const filteredContracts = filterContracts(TOKENS, contractdetails)
  const details = filteredContracts.map(async (token) => {
    let value = token.amount
    if (token.protocol_id === contractProtocoldetails.protocol_id) {
      value += contractProtocoldetails.amount
    }
    const dollarValue = token.price * value
    return {
      id: token.symbol,
      contractAddress: token.id,
      token: value,
      raw_dollar: dollarValue,
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
  const sortedTreasuryDetails = allTreasureDetails.sort(
    (a, b) => b.raw_dollar - a.raw_dollar,
  )
  let totalAccountValue = 0
  sortedTreasuryDetails.forEach((token) => {
    if (token.raw_dollar > 20000) {
      totalAccountValue += token.raw_dollar
    }
  })
  const filteredSortedDetails = sortedTreasuryDetails.filter(
    (token) => token.raw_dollar > 20000,
  )
  return { totalAccountValue, sortedTreasuryDetails: filteredSortedDetails }
}
