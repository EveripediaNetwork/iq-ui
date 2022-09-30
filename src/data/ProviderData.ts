import { Fraxswap } from '@/components/icons/fraxswap'
import { SushiSwap } from '@/components/icons/sushiswap'
import { UniSwapV2 } from '@/components/icons/uniswapV2'
import { UniSwapV3 } from '@/components/icons/uniswapV3'
import { Zapper } from '@/components/icons/zapper'
import { Zerion } from '@/components/icons/zerion'
import { CustomIconType } from './SidebarData'

export const PROVIDERS: ProviderType[] = [
  {
    name: 'Uniswap V2',
    icon: UniSwapV2,
    route: 'https://app.uniswap.org/#/swap',
  },
  {
    name: 'Uniswap V3',
    icon: UniSwapV3,
    route: 'https://app.uniswap.org/#/swap',
  },
  {
    name: 'Sushiswap',
    icon: SushiSwap,
    route:
      'https://app.sushi.com/swap?inputCurrency=0x579CEa1889991f68aCc35Ff5c3dd0621fF29b0C9&outputCurrency=0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  },
  {
    name: 'Fraxswap',
    icon: Fraxswap,
    route: 'https://app.frax.finance/swap/main',
  },
  {
    name: 'Zerion',
    icon: Zerion,
    route: 'https://app.zerion.io/swap',
  },
  {
    name: 'Zapper',
    icon: Zapper,
    route:
      'https://zapper.fi/exchange?sellToken=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9&buyToken=0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  {
    name: 'Zerion',
    icon: Zerion,
    route: 'https://app.zerion.io/swap',
  },
  {
    name: 'Zapper',
    icon: Zapper,
    route:
      'https://zapper.fi/exchange?sellToken=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9&buyToken=0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
]

export type ProviderType = {
  name: string
  icon: CustomIconType
  route: string
}
