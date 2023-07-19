export type TreasuryTokenType = {
  contractAddress: string
  token: number | { amount: number; symbol: string }[]
  raw_dollar: number
  id: string
  yield?: number
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
export type ResponseData = {
  status: boolean
  message: string
  response?: ContractDetailsType[]
}

export type LpTokenDetailsType = {
  pool: {
    id: string
    adapter_id: string
    controller: string
  }
  stats: {
    asset_usd_value: string
  }
  detail: {
    supply_token_list: { amount: number; symbol: string }[]
  }
}
