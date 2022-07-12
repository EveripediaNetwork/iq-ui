import { Fraxswap } from '@/components/icons/fraxswap'
import { SushiSwap } from '@/components/icons/sushiswap'
import { UniSwapV2 } from '@/components/icons/uniswapV2'
import { UniSwapV3 } from '@/components/icons/uniswapV3'
import { Zapper } from '@/components/icons/zapper'
import { Zerion } from '@/components/icons/zerion'
import { IconProps } from '@chakra-ui/icon'
import { CustomIconType } from './SidebarData'

export const PROVIDERS: ProviderType[] = [
  {
    name: 'Uniswap V2',
    icon: UniSwapV2,
  },
  {
    name: 'Uniswap V3',
    icon: UniSwapV3,
  },
  {
    name: 'Sushiswap',
    icon: SushiSwap,
  },
  {
    name: 'Fraxswap',
    icon: Fraxswap,
  },
  {
    name: 'Zerion',
    icon: Zerion,
  },
  {
    name: 'Zapper',
    icon: Zapper,
  },
]

export type ProviderType = {
  name: string
  icon: CustomIconType
}
