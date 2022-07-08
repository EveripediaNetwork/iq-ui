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
    type: 'ICON',
  },
  {
    label: 'Swap',
    route: '/dashboard/swap',
    icon: RiSwapFill,
    type: 'ICON',
  },
  {
    label: 'Bridge',
    route: '/dashboard/bridge',
    icon: RiRainbowFill,
    type: 'ICON',
  },
  {
    label: 'Lock',
    route: '/dashboard/lock',
    icon: RiLockFill,
    type: 'ICON',
  },
  {
    label: 'Staking',
    route: '/dashboard/staking',
    icon: RiStackFill,
    type: 'ICON',
  },
  {
    label: 'Voting',
    route: '/dashboard/voting',
    icon: RiAuctionFill,
    type: 'ICON',
  },
  {
    label: 'Stats',
    route: '/dashboard/stats',
    icon: RiBarChartFill,
    type: 'ICON',
  },
  {
    label: 'Guages',
    route: '/dashboard/guages',
    icon: RiScalesFill,
    type: 'ICON',
  },
  {
    label: 'Raffles',
    route: '/dashboard/raffles',
    icon: RiTicketFill,
    type: 'ICON',
  },
  {
    label: 'Treasury',
    route: '/dashboard/treasure',
    icon: RiCoinFill,
    type: 'ICON',
  },
]

export const EXTRA_ROUTES: SidebarItemType[] = [
  {
    label: 'Learn',
    route: '/dashboard/settings',
    icon: RiBook2Fill,
    type: 'ICON',
  },
  {
    label: 'Brainies NFT',
    route: '/dashboard/settings',
    image: '/images/brainies-logo.svg',
    type: 'IMAGE',
  },
  {
    label: 'Everipedia',
    route: '/dashboard/settings',
    image: '/images/braindao-logo.svg',
    type: 'IMAGE',
  },
  {
    label: 'Settings',
    route: '/dashboard/settings',
    icon: RiSettings2Fill,
    type: 'ICON',
  },
]

export type SidebarItemType = {
  label: string
  route: string
  icon?: IconType
  image?: string
  type: 'ICON' | 'IMAGE'
}
