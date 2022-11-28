import config from '@/config'
import { chain, TREASURY_ADDRESSES } from '@/data/treasury-data'
import { ContractDetailsType } from '@/types/TreasuryTokenType'
import axios from 'axios'
import { formatContractResult } from './LockOverviewUtils'

const fetchContractTokens = async (payload: {
  tokenAddress: string
  chain: string
}) => {
  try {
    const result = await axios.get('/api/token-details', {
      params: { ...payload },
    })
    return result.data.response
  } catch (err) {
    console.log(err)
  }
  return undefined
}

export const filterContracts = (
  contractAddresses: string[],
  contractBalances: ContractDetailsType[],
) => {
  const filteredResult = contractBalances.filter(contractDetails =>
    contractAddresses.includes(contractDetails.id),
  )
  return filteredResult
}

export const getTreasuryDetails = async () => {
  const payload = {
    tokenAddress: config.treasuryAddress as string,
    chain: chain.Eth,
  }
  const contractdetails: ContractDetailsType[] = await fetchContractTokens(
    payload,
  )
  const filteredContracts = filterContracts(TREASURY_ADDRESSES, contractdetails)
  const details = filteredContracts.map(async token => {
    const value = formatContractResult(token.raw_amount_hex_str)
    const dollarValue = token.price * value
    return {
      id: token.symbol,
      contractAddress: token.id,
      token: value,
      price: token.price,
      raw_dollar: dollarValue,
    }
  })
  const treasuryDetails = await Promise.all(details)
  const sortedTreasuryDetails = treasuryDetails.sort(
    (a, b) => b.raw_dollar - a.raw_dollar,
  )
  let totalAccountValue = 0
  sortedTreasuryDetails.forEach(token => {
    totalAccountValue += token.raw_dollar
  })
  return { totalAccountValue, sortedTreasuryDetails }
}
