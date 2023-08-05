import { BraindaoLogo } from '@/components/braindao-logo'
import { FXS } from '@/components/icons/fxs'
import { IconProps } from '@chakra-ui/react'
import { WETH } from '@/components/icons/weth'
import { Fraxswap } from '@/components/icons/fraxswap'
import { SLP } from '@/components/icons/slp'
import { SfrxETH } from '@/components/icons/sfrxETH'
import { FraxIQ } from '@/components/icons/frax-iq'

export const TOKEN_KEYS = ['Name', 'Tokens', '% yield', 'Dollar Amount (%)']
export type TokensType = {
  [key: string]: {
    id: string
    icon?: (icon: IconProps) => JSX.Element
    image?: string
    name: string
    address: string
    stakeId?: string
  }
}
export const TOKENS: TokensType = {
  IQ: {
    id: 'everipedia',
    icon: BraindaoLogo,
    name: 'IQ',
    address: '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  },
  WETH: {
    id: 'weth',
    icon: WETH,
    name: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  FRAX: {
    id: 'frax',
    icon: Fraxswap,
    name: 'FRAX',
    address: '0x853d955acef822db058eb8505911ed77f175b99e',
  },
  FXS: {
    id: 'frax-share',
    icon: FXS,
    name: 'FXS',
    address: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
  },
  SLP: {
    id: 'shushiswap-iq-eth',
    icon: SLP,
    name: 'IQ-ETH Sushiswap',
    address: '0x9d45081706102e7aaddd0973268457527722e274',
  },
  sfrxETH: {
    id: 'staked-frax-ether',
    icon: SfrxETH,
    name: 'sfrxETH',
    address: '0xac3e018457b222d93114458476f3e3416abbe38f',
  },
  WBTC: {
    id: 'wrapped-btc',
    image: '/images/wbtc.svg',
    name: 'WBTC',
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  frax_v2_multi_farming: {
    id: 'frax_v2_multi_farming',
    icon: FraxIQ,
    name: 'Frax+IQ',
    address: '0x7af00cf8d3a8a75210a5ed74f2254e2ec43b5b5b',
  },
  APE: {
    id: 'apecoin',
    image: '/images/apecoin.svg',
    name: 'APE',
    address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    stakeId: 'apestake',
  },
  convex_personal_staked: {
    id: 'convex_personal_staked',
    image: '/images/convex.svg',
    name: 'IQ-FRAX Convex',
    address: '0x41a5881c17185383e19df6fa4ec158a6f4851a69',
  },
  frax_lending: {
    id: 'frax_lending',
    icon: Fraxswap,
    name: 'FraxLend',
    address: '0x3835a58ca93cdb5f912519ad366826ac9a752510',
  },
  convex_cvxfxs_staked: {
    id: 'convex_cvxfxs_staked',
    image: '/images/cvxFXS.png',
    name: 'cvxFXS',
    address: '0x49b4d1df40442f0c31b1bbaea3ede7c38e37e31a',
  },
  convex_cvxfpis_staked: {
    id: 'convex_cvxfpis_staked',
    image: '/images/cvxFPIS.png',
    name: 'cvxFPIS',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
}

export const tokenIds = Object.values(TOKENS).map((tok) => tok.id)

export const PIE_CHART_COLORS: {
  [key: string]: { light: string; dark: string }
} = {
  IQ: { light: '#FF5CAA', dark: '#FF5CAA' },
  WETH: { light: '#3182CE', dark: '#3182CE' },
  FRAX: { light: '#1A202C', dark: '#fff' },
  'IQ-ETH Sushiswap': { light: '#4A5568', dark: '#4A5568' },
  SLP: { light: '#90CDF4', dark: '#90CDF4' },
  sfrxETH: { light: '#805AD5', dark: '#805AD5' },
  'Frax+IQ': { light: '#093687', dark: '#093687' },
  APE: { light: '#03fa6e', dark: '#065026' },
  'IQ-FRAX Convex': { light: '#f7d58a ', dark: '#f3bc46' },
  WBTC: { light: '#f7d58a ', dark: '#f3bc46' },
  FraxLend: { light: '#38e4ff', dark: '#14707e' },
  cvxFXS: { light: '#38a4bf', dark: '#14e07e' },
  cvxFPIS: { light: '#b1fc87', dark: '#1c4d01 ' },
  FXS: { light: '#093687', dark: '#093687' },
}

export const HOLDERS_PIE_CHART_COLORS: { light: string; dark: string }[] = [
  { light: '#FF5CAA', dark: '#FF5CAA' },
  { light: '#3182CE', dark: '#3182CE' },
  { light: '#1A202C', dark: '#fff' },
  { light: '#4A5568', dark: '#4A5568' },
  { light: '#90CDF4', dark: '#90CDF4' },
  { light: '#805AD5', dark: '#805AD5' },
  { light: '#093687', dark: '#093687' },
  { light: '#03fa6e', dark: '#065026' },
]

export const VOTE_CHART_COLORS: {
  [key: string]: { light: string; dark: string }
} = {
  TEST: { light: '#FF5CAA', dark: '#FF5CAA' },
  BRAINY: { light: '#3182CE', dark: '#3182CE' },
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
  {
    image: '/images/lightman.jpeg',
    id: 4,
    title: 'Lightbulb Man',
    body: 'Lightbulb Man #550',
    href: 'https://opensea.io/assets/ethereum/0x4c9a6c3fe98b5ae3a8c652709a1e04574aec1702/82',
  },
]

export const chain = {
  Eth: 'eth',
  Matic: 'matic',
  Frax: 'frax',
}
