export type TreasuryTokenType = {
  contractAddress: string
  token: number
  price: number
  raw_dollar: number
  id: string
}

export type ContractDetailsType = {
  name: string
  price: number
  symbol: string
  id: string
  raw_amount_hex_str: string
  amount: number
  protocol_id: string
}
