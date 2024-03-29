import { Bsc } from '@/components/icons/bsc'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { NetworkType } from '@/types/NetworkType'

export const NETWORK_DATA: NetworkType[] = [
  {
    id: 1,
    name: 'Ethereum',
    icon: Ethereum,
    isActive: true,
  },
  {
    id: 2,
    name: 'Polygon',
    icon: Polygon,
    isActive: false,
  },
  {
    id: 3,
    name: 'BSC',
    icon: Bsc,
    isActive: false,
  },
]
