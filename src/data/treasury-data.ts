import { BraindaoLogo } from '@/components/braindao-logo'
import { ENS } from '@/components/icons/ens'
import { FXS } from '@/components/icons/fxs'
import { IconProps } from '@chakra-ui/icon'
import { WETH } from '@/components/icons/weth'
import { Fraxswap } from '@/components/icons/fraxswap'

export const TOKEN_KEYS = ['Name', 'Tokens', 'Dollar Amount (%)']

export const TOKENS: {
  [key: string]: {
    id: string
    icon: (icon: IconProps) => JSX.Element
    name: string
  }
} = {
  IQ: {
    id: 'everipedia',
    icon: BraindaoLogo,
    name: 'IQ',
  },
  WETH: {
    id: 'weth',
    icon: WETH,
    name: 'WETH',
  },
  FRAX: {
    id: 'frax',
    icon: Fraxswap,
    name: 'FRAX',
  },
  FXS: {
    id: 'frax-share',
    icon: FXS,
    name: 'FXS',
  },
  ENS: {
    id: 'ethereum-name-service',
    icon: ENS,
    name: 'ENS',
  },
}

export const tokenIds = Object.values(TOKENS).map(tok => tok.id)

export const PIE_CHART_COLORS: {
  [key: string]: { light: string; dark: string }
} = {
  IQ: { light: '#FF5CAA', dark: '#FF5CAA' },
  WETH: { light: '#3182CE', dark: '#3182CE' },
  FRAX: { light: '#1A202C', dark: '#fff' },
  FXS: { light: '#4A5568', dark: '#4A5568' },
  ENS: { light: '#90CDF4', dark: '#90CDF4' },
}

export const TREASURIES = [
  {
    image: '/images/ape.png',
    id: 1,
    title: 'Bored Ape',
    body: 'BAYC #9665',
    href: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9665',
  },
  {
    image: '/images/penguin.jpg',
    id: 2,
    title: 'Pudgy Penguin',
    body: 'Pudgy Penguin #2614',
    href: 'https://opensea.io/assets/ethereum/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/2614',
  },
  {
    image: '/images/gnostic.avif',
    id: 3,
    title: 'Hashmasks',
    body: 'Gnostic',
    href: 'https://opensea.io/assets/ethereum/0xc2c747e0f7004f9e8817db2ca4997657a7746928/6992',
  },
]

export const chain = {
  Eth: 'eth',
  Matic: 'matic',
}

export const TREASURY_ADDRESSES = [
  '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
]
