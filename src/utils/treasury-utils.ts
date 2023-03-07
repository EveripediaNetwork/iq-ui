import config from '@/config'
import { chain, TOKENS, TokensType } from '@/data/treasury-data'
import {
  ContractDetailsType,
  TreasuryTokenType,
  LpTokenDetailsType,
} from '@/types/TreasuryTokenType'
import axios from 'axios'
import { formatContractResult } from './LockOverviewUtils'

const SUPPORTED_LP_TOKENS_ADDRESSES = [
  '0x7af00cf8d3a8a75210a5ed74f2254e2ec43b5b5b',
]

const fetchEndpointData = async (
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
) => {
  const filteredResult = contractBalances.filter(contractDetails =>
    Object.entries(tokens).some(
      ([, value]) => contractDetails.id === value.address,
    ),
  )
  return filteredResult
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
  const lpTokenDetailsPayload = {
    tokenId: config.treasuryAddress as string,
    protocolId: chain.Frax,
  }
  const contractdetails: ContractDetailsType[] = await fetchEndpointData(
    contractDetailsPayload,
    '/api/token-details',
  )
  const contractProtocoldetails: any = await fetchEndpointData(
    protocolDetailsPayload,
    '/api/protocols',
  )
  const lpTokenDetails: LpTokenDetailsType[] = (
    await fetchEndpointData(lpTokenDetailsPayload, '/api/lp-token')
  ).portfolio_item_list

  console.log(contractProtocoldetails)

  const filteredContracts = filterContracts(TOKENS, contractdetails)
  const details = filteredContracts.map(async token => {
    let value = formatContractResult(token.raw_amount_hex_str)
    if (token.protocol_id === contractProtocoldetails.id) {
      value +=
        contractProtocoldetails.portfolio_item_list[0].asset_dict[token.id]
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
  lpTokenDetails.forEach(lp => {
    if (SUPPORTED_LP_TOKENS_ADDRESSES.includes(lp.pool.id)) {
      additionalTreasuryData.push({
        id: lp.pool.adapter_id,
        contractAddress: lp.pool.id,
        raw_dollar: lp.stats.asset_usd_value as unknown as number,
        token: lp.detail.supply_token_list.map(supply => ({
          amount: supply.amount,
          symbol: supply.symbol,
        })),
      })
    }
  })
  const allTreasureDetails = [...treasuryDetails, ...additionalTreasuryData]
  const sortedTreasuryDetails = allTreasureDetails.sort(
    (a, b) => b.raw_dollar - a.raw_dollar,
  )
  let totalAccountValue = 0
  sortedTreasuryDetails.forEach(token => {
    totalAccountValue += token.raw_dollar
  })
  return { totalAccountValue, sortedTreasuryDetails }
}
