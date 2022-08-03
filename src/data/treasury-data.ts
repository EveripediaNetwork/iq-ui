import { BraindaoLogo } from '@/components/braindao-logo'
import { EOSLogo1 } from '@/components/icons/eos-logo-1'
import { Ethereum } from '@/components/icons/ethereum'
import { SushiSwap } from '@/components/icons/sushiswap'
import { UniSwapV3 } from '@/components/icons/uniswapV3'

export const TOKEN_KEYS = ['Name', 'Tokens', 'Dollar Amount (%)']

export const TOKENS = [
  {
    icon: BraindaoLogo,
    name: 'IQ',
    tokens: '99,999.99 IQ ',
    dollarAmount: '$2.37M (24.09%)',
  },
  {
    icon: SushiSwap,
    name: 'FRAX/IQ V3',
    tokens: '99,999.99 FRAX/IQ  ',
    dollarAmount: '$2.37M (24.09%)',
  },
  {
    icon: UniSwapV3,
    name: 'Uniswap FRAX/IQ',
    tokens: '99,999.99 FRAX/IQ ',
    dollarAmount: '$2.37M (24.09%)',
  },
  {
    icon: EOSLogo1,
    name: 'FXS',
    tokens: '99,999.99 FXS ',
    dollarAmount: '$2.37M (24.09%)',
  },
  {
    icon: Ethereum,
    name: 'ETH',
    tokens: '99,999.99 FXS ',
    dollarAmount: '$2.37M (24.09%)',
  },
]

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
