import { BraindaoLogo } from '@/components/braindao-logo'
import { IqgptLogo } from '@/components/iqgpt-logo'
import { IconProps } from '@chakra-ui/react'
import { IconType } from 'react-icons/lib'
import {
  RiAppsFill,
  RiSwapFill,
  RiRainbowFill,
  RiLockFill,
  RiAuctionFill,
  RiBarChartFill,
  RiTicketFill,
  RiCoinFill,
  RiBook2Fill,
  RiStackFill,
} from 'react-icons/ri'

export const MAIN_ROUTES: SidebarItemType[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: RiAppsFill,
  },
  {
    label: 'Swap',
    route: '/dashboard/swap',
    icon: RiSwapFill,
  },
  {
    label: 'Bridge',
    route: '/dashboard/bridge',
    icon: RiRainbowFill,
  },
  {
    label: 'Stake',
    route: '/dashboard/stake',
    icon: RiLockFill,
  },
  {
    label: 'Bonds',
    route: 'https://app.bondprotocol.finance/#/market/1/80',
    icon: RiStackFill,
    target: '_blank',
  },
  {
    label: 'Voting',
    route: '/dashboard/voting',
    icon: RiAuctionFill,
  },
  {
    label: 'Stats',
    route: '/dashboard/stats',
    icon: RiBarChartFill,
  },
  // {
  //   label: 'Gauges',
  //   route: '/dashboard/gauges',
  //   icon: RiScales3Fill,
  // },
  {
    label: 'Raffles',
    route: '/dashboard/raffles',
    icon: RiTicketFill,
  },
  {
    label: 'Treasury',
    route: '/dashboard/treasury',
    icon: RiCoinFill,
  },
]

export const EXTRA_ROUTES: SidebarItemType[] = [
  {
    label: 'Learn',
    route: 'https://learn.everipedia.org/iq/',
    icon: RiBook2Fill,
    target: '_blank',
  },
  {
    label: 'IQ.wiki',
    route: 'https://iq.wiki/wiki/iqwiki',
    icon: BraindaoLogo,
    target: '_blank',
  },
  {
    label: 'IQ.GPT',
    route: 'https://iqgpt.com',
    icon: IqgptLogo,
    target: '_blank',
  },
  {
    label: 'IQ.social',
    route: 'https://iq.social/',
    icon: BraindaoLogo,
    target: '_blank',
  },
  {
    label: 'IQ Code',
    route: 'https://iqcode.ai/',
    icon: BraindaoLogo,
    target: '_blank',
  },
]

export type SidebarItemType = {
  label: string
  route: string
  icon: IconType | CustomIconType | string
  target?: string
}

export type CustomIconType = (props: IconProps) => JSX.Element
