import { Bsc } from '@/components/icons/bsc'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { NetworkType } from '@/types/NetworkType'

export const NETWORK_DATA: NetworkType[] = [
  {
    id: 1,
    name: 'polygon',
    icon: Polygon,
    isActive: true,
  },
  {
    id: 2,
    name: 'Ethereum',
    icon: Ethereum,
    isActive: false,
  },
  {
    id: 3,
    name: 'Bsc',
    icon: Bsc,
    isActive: false,
  },
]
