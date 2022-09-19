import { BraindaoLogo } from '@/components/braindao-logo'
import { Ethereum } from '@/components/icons/ethereum'
import { FraxFinance } from '@/components/icons/frax-finance'
import { FXS } from '@/components/icons/fxs'
import { UniSwapV3 } from '@/components/icons/uniswapV3'

export const TOKEN_KEYS = ['Name', 'Tokens', 'Dollar Amount (%)']

export const TOKENS = [
  {
    id: 'everipedia',
    icon: BraindaoLogo,
    name: 'IQ',
  },
  {
    id: 'ethereum',
    icon: FraxFinance,
    name: 'FRAX/IQ V3',
  },
  {
    id: 'uniswap',
    icon: UniSwapV3,
    name: 'Uniswap FRAX/IQ',
  },
  {
    id: 'frax-share',
    icon: FXS,
    name: 'FXS',
  },
  {
    id: 'ethereum',
    icon: Ethereum,
    name: 'ETH',
  },
]

export const tokenIds = Object.values(TOKENS).map(tok => tok.id)

export const PIE_CHART_DATA = [
  { name: 'Group F', value: 165 },
  { name: 'Group E', value: 45 },
  { name: 'Group D', value: 35 },
  { name: 'Group C', value: 15 },
  { name: 'Group B', value: 40 },
  { name: 'Group A', value: 60 },
]

export const PIE_CHART_COLORS = [
  '#9F7AEA',
  '#B83280',
  '#F687B3',
  '#FC8181',
  '#FBB6CE',
  '#D6BCFA',
]

export const TREASURIES = [
  {
    image: '/images/ape.png',
    id: 1,
    title: 'Bored Ape',
    body: 'BAYC #9665',
    href: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9665',
  },
  {
    image: '/images/tba.png',
    id: 2,
    title: 'Soon',
    body: 'TBA',
    href: '',
  },
  {
    image: '/images/tba.png',
    id: 3,
    title: 'Soon',
    body: 'TBA',
    href: '',
  },
]
