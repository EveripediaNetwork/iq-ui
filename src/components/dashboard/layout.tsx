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
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useScroll } from 'framer-motion'

type DashboardLayoutProps = {
  children: React.ReactNode
  squeeze?: boolean
}
export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { children, squeeze } = props
  const sidebarDisclosure = useDisclosure()
  const ref = useRef<HTMLDivElement | null>(null)
  const [y, setY] = useState(0)
  const height = ref.current ? ref.current.getBoundingClientRect() : 0
  const { scrollY } = useScroll()
  useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  const pagePadding = {
    px: { base: '6', md: '7', lg: '10' },
    py: { base: '5', lg: '6' },
  }

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
          w="20.25em"
          borderRightColor="divider"
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
            md: 'xs',
          }}
        >
          <DrawerOverlay />
          <DrawerContent bg="pageBg">
            <DrawerCloseButton display={{ base: 'none', md: 'inherit' }} />
            <Sidebar mb="4.375em" />
          </DrawerContent>
        </Drawer>
        <chakra.div w="full" maxH="100vh" overflow="auto">
          <chakra.div
            w="full"
            h="4.375em"
            pos="fixed"
            px="6"
            bottom="0"
            borderTopColor="whiteAlpha.300"
            borderTopWidth="1px"
            display={{ md: 'none' }}
            zIndex="popover"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            backdropFilter="blur(2px)"
            bg="bodyBg"
          >
            <Navbar h="unset" />
          </chakra.div>

          <chakra.div
            h="4.375em"
            borderBottomColor="divider"
            borderBottomWidth="1px"
            pos="sticky"
            top="0"
            px="6"
            ref={ref}
            shadow={y > height ? 'sm' : undefined}
            transition="box-shadow 0.2s"
            backdropFilter="blur(2px)"
            bg="bodyBg"
            zIndex="sticky"
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
            maxW={{ '2xl': 'container.xl' }}
            {...(!squeeze && pagePadding)}
            mx="auto"
            h="auto"
          >
            {children}
          </chakra.div>
        </chakra.div>
      </Flex>
    </DashboardProvider>
  )
}
