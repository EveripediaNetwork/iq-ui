import { IQLogo } from '@/components/iq-logo'
import { FXS } from '@/components/icons/fxs'
import { IconProps } from '@chakra-ui/react'
import { WETH } from '@/components/icons/weth'
import { Fraxswap } from '@/components/icons/fraxswap'
import { SLP } from '@/components/icons/slp'
import { SfrxETH } from '@/components/icons/sfrxETH'
import { FraxIQ } from '@/components/icons/frax-iq'

export const TOKEN_KEYS = ['headerKey1', 'headerKey2', 'headerKey3']
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
    icon: IQLogo,
    name: 'IQ',
    address: '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  },
  HiIQ: {
    id: 'everipedia',
    icon: IQLogo,
    name: 'HiIQ',
    address: '0xaCa39B187352D9805DECEd6E73A3d72ABf86E7A0',
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
  convex_staked: {
    id: 'convex_staked',
    image: '/svgs/convex-staked.svg',
    name: 'frxETH + IQ',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
  WBTC: {
    id: 'wrapped-btc',
    image: '/svgs/wbtc.svg',
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
    image: '/svgs/apecoin.svg',
    name: 'APE',
    address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    stakeId: 'apestake',
  },
  convex_personal_staked: {
    id: 'convex_personal_staked',
    image: '/svgs/convex.svg',
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
    image: '/images/cvxfxs.png',
    name: 'cvxFXS',
    address: '0x49b4d1df40442f0c31b1bbaea3ede7c38e37e31a',
  },
  convex_cvxfpis_staked: {
    id: 'convex_cvxfpis_staked',
    image: '/images/cvxfpis.png',
    name: 'stkCvxFPIS',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
  eigenlayer_deposit2: {
    id: 'eigenlayer_deposit2',
    name: 'frxETH EigenLayer',
    image: '/svgs/frx-eth.svg',
    address: '0x39053d51b77dc0d36036fc1fcc8cb819df8ef37a',
  },
  eigenlayer_yield: {
    id: 'eigenlayer_yield',
    name: 'frxETH EigenLayer',
    image: '/svgs/frx-eth.svg',
    address: '0x8ca7a5d6f3acd3a7a8bc468a8cd0fb14b6bd28b6',
  },
  FPIS: {
    id: 'convex_cvxfpis_staked',
    image: '/images/cvxfpis.png',
    name: 'FPIS',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
  'prisma-PRISMAETH-f': {
    id: 'prisma-PRISMAETH-f',
    name: 'prismaETH-f',
    address: '0x685E852E4c18c2c554a1D25c1197684fd9593145',
    image: '/svgs/prisma-eth.svg',
  },
  'FraxlendV1 - FXS/FRAX': {
    id: 'convex_cvxfxs_staked',
    image: '/images/cvxfxs.png',
    name: 'FraxlendV1',
    address: '0x49b4d1df40442f0c31b1bbaea3ede7c38e37e31a',
  },
  CVX: {
    id: 'convex_cvxfpis_staked',
    name: 'CVX',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
  ENS: {
    id: 'convex_cvxfpis_staked',
    name: 'ENS',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
  CRV: {
    id: 'convex_cvxfpis_staked',
    name: 'CRV',
    address: '0xfa87db3eaa93b7293021e38416650d2e666bc483',
  },
  sDAI: {
    id: 'sDAI',
    name: 'sDAI',
    address: '0x83f20f44975d03b1b09e64809b757c47f942beea',
  },
  sFRAX: {
    id: 'sFRAX',
    image: '/svgs/sfrax.svg',
    name: 'sFRAX',
    address: '0x03cb4438d015b9646d666316b617a694410c216d',
  },
  'sFRAX Fraxtal': {
    id: 'sFRAX Fraxtal',
    image: '/svgs/sfrax.svg',
    name: 'sFRAX Fraxtal',
    address: '0xfc00000000000000000000000000000000000008',
  },
  cvxFXS: {
    id: 'cvxFXS',
    image: '/images/cvxfxs.png',
    name: 'cvxFXS',
    address: '0xFEEf77d3f69374f66429C91d732A244f074bdf74',
  },
  'frxETHIQ-f': {
    id: 'frxETHIQ-f',
    name: 'frxETHIQ-f',
    image: '/svgs/frx-ethiq.svg',
    address: '0x4AE86d8732390d852A13cb918463BC6e5775FaDD',
  },
  frxETH: {
    id: 'frxETH',
    name: 'frxETH',
    address: '0x5e8422345238f34275888049021821e8e08caa1f',
  },
  cvxFPIS: {
    id: 'cvxFPIS',
    name: 'cvxFPIS',
    address: '0xa2847348b58ced0ca58d23c7e9106a49f1427df6',
  },
  FXB241231: {
    id: 'FXB241231',
    name: 'FXB241231',
    address: '0x6307E6688819951Cf8D6B6066018243D2496952F',
    image: '/svgs/fxb.svg',
  },
  FXB261231: {
    id: 'FXB261231',
    name: 'FXB261231',
    address: '0xe035e27a8ed6842b478933820f90093d205f7098',
    image: '/svgs/fxb.svg',
  },
  '0x8c279f6bfa31c47f29e5d05a68796f2a6c216892': {
    id: 'stkcvxFxs Fraxtal',
    name: 'cvxFxs FXTL',
    address: '0x8c279f6bfa31c47f29e5d05a68796f2a6c216892',
    image: '/svgs/stkcvx.svg',
  },
  '0x1872621050cc3c267c1982c6d199b7d6a4d0e87a': {
    id: 'FXB20551231',
    name: 'FXB20551231 FXTL',
    address: '0x1872621050cc3c267c1982c6d199b7d6a4d0e87a',
    image: '/svgs/FXB.svg',
  },
  '0x22c4649ea0937e86ab64366ddfb39d6769874b17': {
    id: 'FXB20251231',
    name: 'FXB20251231 FXTL',
    address: '0x22c4649ea0937e86ab64366ddfb39d6769874b17',
    image: '/svgs/FXB.svg',
  },
  '0xed634f2dd6632d0eb017d44639ae77798a315c0f': {
    id: 'FXB20291231',
    name: 'FXB20291231 FXTL',
    address: '0xed634f2dd6632d0eb017d44639ae77798a315c0f',
    image: '/svgs/FXB.svg',
  },
}

export const tokenIds = Object.values(TOKENS).map((tok) => tok.id)

export const PIE_CHART_COLORS: { light: string; dark: string }[] = [
  { light: '#FF5CAA', dark: '#FF5CAA' },
  { light: '#3182CE', dark: '#3182CE' },
  { light: '#1A202C', dark: '#fff' },
  { light: '#4A5568', dark: '#4A5568' },
  { light: '#90CDF4', dark: '#90CDF4' },
  { light: '#805AD5', dark: '#805AD5' },
  { light: '#093687', dark: '#093687' },
  { light: '#03fa6e', dark: '#065026' },
  { light: '#f7d58a ', dark: '#f3bc46' },
  { light: '#f7d58a ', dark: '#f3bc46' },
  { light: '#38e4ff', dark: '#14707e' },
  { light: '#38a4bf', dark: '#14e07e' },
  { light: '#093687', dark: '#093687' },
  { light: '#b1fc87', dark: '#1c4d01 ' },
  { light: '#FFB6C1', dark: '#FFB6C1' },
  { light: '#6A0572', dark: '#6A0572' },
  { light: '#FFEFD5', dark: '#36302B' },
  { light: '#FFD700', dark: '#FFD700' },
  { light: '#E63946', dark: '#E63946' },
  { light: '#FFD700', dark: '#FFD700' },
  { light: '#F4A261', dark: '#2A9D8F' },
  { light: '#A8DADC', dark: '#1D3557' },
  { light: '#F4A261', dark: '#2A9D8F' },
  { light: '#F4A261', dark: '#2A9D8F' },
]

export const VOTE_CHART_COLORS: {
  [key: string]: { light: string; dark: string }
} = {
  TEST: { light: '#FF5CAA', dark: '#FF5CAA' },
  BRAINY: { light: '#3182CE', dark: '#3182CE' },
}

export const TREASURIES = [
  {
    image: '/images/ercc1579.gif',
    id: 1,
    title: 'Early Retired Cats',
    body: 'ERCC #1579',
    href: 'https://opensea.io/assets/ethereum/0xc5990790f28aec6c5bda469cf7052b996c36ba7f/1898',
  },
  {
    image: '/images/ape.png',
    id: 2,
    title: 'Bored Ape',
    body: 'BAYC #9665',
    href: 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9665',
  },
  {
    image: '/images/penguin.jpg',
    id: 3,
    title: 'Pudgy Penguin',
    body: 'Pudgy Penguin #2614',
    href: 'https://opensea.io/assets/ethereum/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/2614',
  },
  {
    image: '/images/gnostic.avif',
    id: 4,
    title: 'Hashmasks',
    body: 'Gnostic',
    href: 'https://opensea.io/assets/ethereum/0xc2c747e0f7004f9e8817db2ca4997657a7746928/6992',
  },
  {
    image: '/images/lightman.jpeg',
    id: 5,
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
