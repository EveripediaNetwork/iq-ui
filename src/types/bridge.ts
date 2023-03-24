import { SignTransactionResponse } from 'universal-authenticator-library'
import { JsonRpc } from 'eosjs'
import { LegacyRef } from 'react'

export enum TokenId {
  EOS = 'eos',
  PIQ = 'piq',
  IQ = 'iq',
}

const EOS = {
  id: TokenId.EOS,
  label: 'IQ (EOS)',
}

const pIQ = {
  id: TokenId.PIQ,
  label: 'pIQ',
}

const IQ = {
  id: TokenId.IQ,
  label: 'IQ (ETH)',
}

export type Token = {
  id: TokenId
  label: string
  to: {
    id: TokenId
    label: string
  }
}

export const TOKENS: Array<Token> = [
  {
    ...EOS,
    to: pIQ,
  },
  {
    ...pIQ,
    to: IQ,
  },
  {
    ...IQ,
    to: EOS,
  },
]

export const initialBalances = [
  {
    id: TokenId.EOS,
    balance: '0',
  },
  {
    id: TokenId.PIQ,
    balance: '0',
  },
  {
    id: TokenId.IQ,
    balance: '0',
  },
]

type EosAuthorizationBody = {
  actor: string
  permission: string
}

type EosActionBody = {
  account: string
  name: string
  authorization: EosAuthorizationBody[]
  data: {
    from: string
    to: string
    quantity: string
    memo: string
  }
}

type EosTransactionBody = {
  actions: Array<EosActionBody>
}

type EosTransactionOptions = {
  broadcast: boolean
  expireSeconds: number
}

export type CardFooterType = {
  selectedToken: Token
  pIQbalance: number
}

export type DestinationInfoType = {
  selectedToken: Token
  getEstimatedArrivingAmount: () => number
  inputRef: LegacyRef<HTMLInputElement> | undefined
  isBalanceZero: () => boolean
  handleSetInputAddressOrAccount: (value: string) => void
  handleEOSLoginAndLogout: () => void
  authContext: AuthContextType
}

export type OriginInfoType = {
  selectedToken: Token
  isBalanceZero: () => boolean
  tokenInputAmount: string | undefined
  setTokenInputAmount: (amount: string) => void
  getSpecificBalance: (id: TokenId) => number
}

export type TokenMenuLayoutType = {
  selectedTokenIcon: JSX.Element
  selectedToken: Token
  handlePathChange: (id: TokenId) => void
}
export type AuthContextType = {
  activeUser: {
    accountName: string
    chainId: string
    appName: string
    rpc: JsonRpc
    signTransaction: (
      transaction: EosTransactionBody,
      options: EosTransactionOptions,
    ) => SignTransactionResponse
  }
  message: string
  loading: boolean
  hideModal: () => void
  restart: () => void
  logout: () => void
  showModal: () => void
}

export const getToken = (id: TokenId) => TOKENS.find(tok => tok.id === id)
