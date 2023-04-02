import { BraindaoLogo } from '@/components/braindao-logo'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { IconProps } from '@chakra-ui/react'

export const tokenDetails: {
  [key: string]: { name: string; logo: (props: IconProps) => JSX.Element }
} = {
  IQ: {
    name: 'everipedia',
    logo: BraindaoLogo,
  },
  ETH: {
    name: 'ethereum',
    logo: Ethereum,
  },
  MATIC: {
    name: 'matic-network',
    logo: Polygon,
  },
  HiIQ: {
    name: 'HiIQ',
    logo: BraindaoLogo,
  },
  GOR: {
    name: 'goerli',
    logo: Ethereum,
  },
}
