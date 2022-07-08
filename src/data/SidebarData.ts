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

export const MAIN_ROUTES = [
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
    label: 'Staking',
    route: '/dashboard/staking',
    icon: RiStackFill,
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
    label: 'Guages',
    route: '/dashboard/guages',
    icon: RiScalesFill,
  },
  {
    label: 'Raffles',
    route: '/dashboard/raffles',
    icon: RiTicketFill,
  },
  {
    label: 'Treasury',
    route: '/dashboard/treasure',
    icon: RiCoinFill,
  },
]

export const EXTRA_ROUTES = [
  {
    label: 'Learn',
    route: '/dashboard/settings',
    icon: RiBook2Fill,
  },
  {
    label: 'Brainies NFT',
    route: '/dashboard/settings',
    icon: RiBook2Fill,
  },
  {
    label: 'Eveipedia',
    route: '/dashboard/settings',
    icon: RiBook2Fill,
  },
  {
    label: 'Settings',
    route: '/dashboard/settings',
    icon: RiSettings2Fill,
  },
]

export type SidebarItemType = typeof MAIN_ROUTES[number]
