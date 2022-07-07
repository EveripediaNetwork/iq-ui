import { UseDisclosureReturn } from '@chakra-ui/react'
import { createContext } from '@chakra-ui/react-utils'
import { RiAppsFill, RiSettings2Fill } from 'react-icons/ri'

export const MAIN_ROUTES = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: RiAppsFill,
  },
]

export type SidebarItemType = typeof MAIN_ROUTES[number]

export const EXTRA_ROUTES = [
  {
    label: 'Settings',
    route: '/settings',
    icon: RiSettings2Fill,
  },
]

export type DashboardContext = {
  sidebarDisclosure: UseDisclosureReturn
}

export const [DashboardProvider, useDashboardContext] =
  createContext<DashboardContext>({
    name: 'ProfilePage',
  })
