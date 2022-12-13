import Navbar from '@/components/dashboard/navbar'
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardProvider } from '@/components/dashboard/utils'
import {
  chakra,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useScroll } from 'framer-motion'
import Link from '../elements/LinkElements/Link'

type DashboardLayoutProps = {
  children: React.ReactNode
  squeeze?: boolean
}
export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { children, squeeze } = props
  const sidebarDisclosure = useDisclosure()
  const { isOpen, onClose } = sidebarDisclosure
  const ref = useRef<HTMLDivElement | null>(null)
  const [y, setY] = useState(0)
  const height = ref.current ? ref.current.getBoundingClientRect() : 0
  const { scrollY } = useScroll()
  const [isMounted, setIsMounted] = useState(false)

  const logoSrc = useColorModeValue(
    'braindao-logo-light.svg',
    'braindao-logo-dark.svg',
  )

  useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const pagePadding = {
    px: { base: '6', md: '7', lg: '10' },
  }

  const providerProps = useMemo(
    () => ({
      sidebarDisclosure,
    }),
    [sidebarDisclosure],
  )

  if (!isMounted) return null

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
          <Sidebar onClose={onClose} />
        </chakra.div>
        <Drawer
          placement="left"
          isOpen={isOpen}
          onClose={onClose}
          size={{
            base: 'full',
            md: 'xs',
          }}
        >
          <DrawerOverlay />
          <DrawerContent bg="sidebarBg">
            <DrawerCloseButton display={{ base: 'none', md: 'inherit' }} />
            <Sidebar mb="4.375em" onClose={onClose} />
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
              align="center"
              mx="auto"
              w="fit-content"
              h="full"
              display={{ base: 'flex', md: 'none' }}
            >
              <Link href="/">
                <Image src={`/images/${logoSrc}`} />
              </Link>
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
