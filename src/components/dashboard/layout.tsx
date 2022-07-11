import { Navbar } from '@/components/dashboard/navbar'
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardProvider } from '@/components/dashboard/utils'
import { BraindaoLogo } from '@/components/braindao-logo'
import {
  chakra,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'

type DashboardLayoutProps = {
  children: React.ReactNode
}
export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { children } = props
  const sidebarDisclosure = useDisclosure()

  const providerProps = useMemo(
    () => ({
      sidebarDisclosure,
    }),
    [sidebarDisclosure],
  )

  return (
    <DashboardProvider value={providerProps}>
      <Flex>
        <chakra.div
          h="100vh"
          w="17.25em"
          borderRightColor="whiteAlpha.200"
          borderRightWidth="1px"
          display={{ base: 'none', lg: 'inherit' }}
        >
          <Sidebar />
        </chakra.div>
        <Drawer
          placement="left"
          isOpen={sidebarDisclosure.isOpen}
          onClose={sidebarDisclosure.onClose}
          size={{
            base: 'full',
            md: 'sm',
          }}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton display={{ base: 'none', md: 'inherit' }} />
            <Sidebar mb="4.375em" />
          </DrawerContent>
        </Drawer>
        <chakra.div w="full" maxH="100vh" overflow="auto">
          <chakra.div
            h="4.375em"
            w="full"
            borderBottomColor="whiteAlpha.200"
            borderBottomWidth="1px"
          >
            <Navbar display={{ base: 'none', md: 'flex' }} />
            <Flex
              gap="2"
              align="center"
              mx="auto"
              w="fit-content"
              h="full"
              display={{ base: 'flex', md: 'none' }}
            >
              <BraindaoLogo />
              <Text fontWeight="bold" fontSize="lg">
                Everipedia
              </Text>
            </Flex>
          </chakra.div>
          <chakra.div
            w="full"
            h="4.375em"
            pos="fixed"
            px="6"
            bottom="0"
            borderTopColor="whiteAlpha.200"
            borderTopWidth="1px"
            display={{ md: 'none' }}
            zIndex="popover"
            bg="whiteAlpha.100"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            backdropFilter="blur(2px)"
          >
            <Navbar h="unset" />
          </chakra.div>
          <chakra.div
            px={{ base: '6', md: '7', lg: '10' }}
            py={{ base: '5', md: '5', lg: '6' }}
            h="full"
            mb="4.375em"
          >
            {children}
          </chakra.div>
        </chakra.div>
      </Flex>
    </DashboardProvider>
  )
}
