import { IQLogo } from '@/components/iq-logo'
import { IqgptLogo } from '@/components/iqgpt-logo'
import { IconProps } from '@chakra-ui/react'
import { IconType } from 'react-icons/lib'
import {
  RiAppsFill,
  RiSwapFill,
  RiLockFill,
  RiAuctionFill,
  RiBarChartFill,
  RiCoinFill,
  RiBook2Fill,
} from 'react-icons/ri'

export const MAIN_ROUTES: SidebarItemType[] = [
  {
    label: 'mainRoutes.dashboard',
    route: '/dashboard',
    icon: RiAppsFill,
  },
  {
    label: 'mainRoutes.swap',
    route: '/dashboard/swap',
    icon: RiSwapFill,
  },
  {
    label: 'mainRoutes.stake',
    route: '/dashboard/stake',
    icon: RiLockFill,
  },
  {
    label: 'mainRoutes.voting',
    route: '/dashboard/voting',
    icon: RiAuctionFill,
  },
  {
    label: 'mainRoutes.stats',
    route: '/dashboard/stats',
    icon: RiBarChartFill,
  },
  {
    label: 'mainRoutes.treasury',
    route: '/dashboard/treasury',
    icon: RiCoinFill,
  },
]

export const EXTRA_ROUTES: SidebarItemType[] = [
  {
    label: 'extraRoutes.learn',
    route: 'https://learn.everipedia.org/iq/',
    icon: RiBook2Fill,
    target: '_blank',
  },
  {
    label: 'extraRoutes.iqAi',
    route: 'https://iqai.io',
    icon: IQLogo,
    target: '_blank',
  },
  {
    label: 'extraRoutes.iqWiki',
    route: 'https://iq.wiki/wiki/iqwiki',
    icon: IQLogo,
    target: '_blank',
  },
  {
    label: 'extraRoutes.iqGpt',
    route: 'https://iqgpt.com',
    icon: IqgptLogo,
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
