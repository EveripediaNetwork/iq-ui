import { UseDisclosureReturn } from '@chakra-ui/react'
import { createContext } from '@chakra-ui/react-utils'

export type DashboardContext = {
  sidebarDisclosure: UseDisclosureReturn
}

export const [DashboardProvider, useDashboardContext] =
  createContext<DashboardContext>({
    name: 'ProfilePage',
  })
