import { RiAppsFill, RiSettings2Fill, RiSwapFill, RiRainbowFill, RiLockFill, RiStackFill, RiAuctionFill, RiBarChartFill, RiScalesFill, RiTicketFill, RiCoinFill, RiBook2Fill } from 'react-icons/ri'

export const MAIN_ROUTES = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: RiAppsFill,
  },
  {
    label: 'Swap',
    route: '/swap',
    icon: RiSwapFill,
  },
  {
    label: 'Bridge',
    route: '/bridge',
    icon: RiRainbowFill,
  },
  {
    label: 'Lock',
    route: '/lock',
    icon: RiLockFill,
  },
  {
    label: 'Staking',
    route: '/staking',
    icon: RiStackFill,
  },
  {
    label: 'Voting',
    route: '/voting',
    icon: RiAuctionFill,
  },
  {
    label: 'Stats',
    route: '/stats',
    icon: RiBarChartFill,
  },
  {
    label: 'Guages',
    route: '/guages',
    icon: RiScalesFill,
  },
  {
    label: 'Raffles',
    route: '/raffles',
    icon: RiTicketFill,
  },
  {
    label: 'Treasury',
    route: '/treasure',
    icon: RiCoinFill,
  },
]

export const EXTRA_ROUTES = [
  {
    label: 'Learn',
    route: '/settings',
    icon: RiBook2Fill,
  },
  {
    label: 'Brainies NFT',
    route: '/settings',
    icon: RiBook2Fill,
  },
  {
    label: 'Eveipedia',
    route: '/settings',
    icon: RiBook2Fill,
  },
  {
    label: 'Settings',
    route: '/settings',
    icon: RiSettings2Fill,
  },
]

export type SidebarItemType = typeof MAIN_ROUTES[number]
