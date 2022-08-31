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

export const TOKENS = [
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

export type AuthContextType = {
  activeUser: {
    accountName: string
    chainId: string
    appName: string
  }
  message: string
  loading: boolean
  hideModal: () => void
  restart: () => void
  logout: () => void
  showModal: () => void
}

export const getToken = (id: TokenId) => TOKENS.find(tok => tok.id === id)
