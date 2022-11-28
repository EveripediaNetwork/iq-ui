import config from '@/config'
import { chain } from '@/data/treasury-data'
import { ContractDetailsType } from '@/types/TreasuryTokenType'
import axios from 'axios'
import { formatContractResult } from './LockOverviewUtils'

const tokenAddresses = [
  '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
]

const fetchContractTokens1 = async (payload: {
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

const transformArrayDetails = (data: string[]) => {
  return data.map(dt => dt.toLowerCase())
}

export const filterContracts = (
  contractAddresses: string[],
  contractBalances: ContractDetailsType[],
) => {
  const filteredResult = contractBalances.filter(contractDetails =>
    transformArrayDetails(contractAddresses).includes(contractDetails.id),
  )
  return filteredResult
}

export const getTreasuryDetails = async () => {
  const payload = {
    tokenAddress: config.treasuryAddress as string,
    chain: chain.Eth,
  }
  const contractdetails: ContractDetailsType[] = await fetchContractTokens1(
    payload,
  )
  const filteredContracts = filterContracts(tokenAddresses, contractdetails)
  const convertedBalances = filteredContracts.map(async token => {
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
  const response = await Promise.all(convertedBalances)
  const sortedResponse = response.sort((a, b) => b.raw_dollar - a.raw_dollar)
  let totalAccountValue = 0
  sortedResponse.forEach(token => {
    totalAccountValue += token.raw_dollar
  })
  return { totalAccountValue, response: sortedResponse }
}
