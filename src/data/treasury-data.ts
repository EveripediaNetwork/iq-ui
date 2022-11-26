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
  everipedia: {
    id: 'everipedia',
    icon: BraindaoLogo,
    name: 'IQ',
  },
  weth: {
    id: 'weth',
    icon: WETH,
    name: 'WETH',
  },
  frax: {
    id: 'frax',
    icon: Fraxswap,
    name: 'FRAX',
  },
  'frax-share': {
    id: 'frax-share',
    icon: FXS,
    name: 'FXS',
  },
  'ethereum-name-service': {
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
};