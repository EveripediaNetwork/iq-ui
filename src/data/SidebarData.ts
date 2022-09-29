import { BraindaoLogo } from '@/components/braindao-logo'
import { IconProps } from '@chakra-ui/icon'
import { IconType } from 'react-icons/lib'
import {
  RiAppsFill,
  RiSettings2Fill,
  RiSwapFill,
  RiRainbowFill,
  RiLockFill,
  RiStackFill,
  RiAuctionFill,
  RiBarChartFill,
  RiScalesFill,
  RiTicketFill,
  RiCoinFill,
  RiBook2Fill,
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
    label: 'Lock',
    route: '/dashboard/lock',
    icon: RiLockFill,
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
  },
  {
    label: 'IQ.Wiki',
    route: 'https://iq.wiki/',
    icon: BraindaoLogo,
  }
]

export type SidebarItemType = {
  label: string
  route: string
  icon: IconType | CustomIconType | string
}

export type CustomIconType = (props: IconProps) => JSX.Element
