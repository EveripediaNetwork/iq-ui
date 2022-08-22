import { BraindaoLogo } from '@/components/braindao-logo'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { IconProps } from '@chakra-ui/icon'

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
  TEST: {
    name: 'everipedia',
    logo: BraindaoLogo,
  },
  HiIQ: {
    name: 'HiIQ',
    logo: BraindaoLogo,
  },
}
