import { BraindaoLogo } from '@/components/braindao-logo'
import { IconProps } from '@chakra-ui/icon'
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
    route: '/dashboards',
    icon: RiAppsFill,
  },
  {
    label: 'Swap',
    route: '/dashboards/swap',
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
    route: 'https://app.bondprotocol.finance/#/market/1/33',
    icon: RiStackFill,
    target: '_blank',
  },
  {
    label: 'Voting',
    route: '/dashboards/voting',
    icon: RiAuctionFill,
  },
  {
    label: 'Stats',
    route: '/dashboard/stats',
    icon: RiBarChartFill,
  },
  {
    label: 'Raffles',
    route: '/dashboards/raffles',
    icon: RiTicketFill,
  },
  {
    label: 'Treasury',
    route: '/dashboards/treasury',
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
    label: 'IQ.Wiki',
    route: 'https://iq.wiki/',
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
