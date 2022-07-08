import { RiAppsFill, RiSettings2Fill } from 'react-icons/ri'

export const MAIN_ROUTES = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: RiAppsFill,
    },
    {
        label: 'Swap',
        route: '/swap',
        icon: RiAppsFill,
      },
]

export const EXTRA_ROUTES = [
    {
      label: 'Settings',
      route: '/settings',
      icon: RiSettings2Fill,
    },
]

export type SidebarItemType = typeof MAIN_ROUTES[number]