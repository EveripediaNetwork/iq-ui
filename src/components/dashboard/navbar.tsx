import {
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  chakra,
  FlexProps,
} from '@chakra-ui/react'
import React from 'react'
import {
  RiCloseFill,
  RiGasStationLine,
  RiMenuLine,
  RiNotificationLine,
} from 'react-icons/ri'
import { FaChevronDown, FaEthereum } from 'react-icons/fa'
import { useDashboardContext } from '@/components/dashboard/utils'
import { LanguageSwitch } from '@/components/dashboard/language-switch'

export const Navbar = (props: FlexProps) => {
  const { sidebarDisclosure } = useDashboardContext()
  const NavIcon = sidebarDisclosure.isOpen ? RiCloseFill : RiMenuLine
  return (
    <Flex
      boxSize="full"
      align="center"
      gap="2.5"
      py="17px"
      px={{ md: '7', lg: '10' }}
      fontSize="sm"
      {...props}
      borderBottom="solid 1px" borderColor="gray.200"
    >
      <IconButton
        aria-label="Toggle Sidebar"
        variant="ghost"
        icon={<NavIcon />}
        fontSize="xl"
        size="xs"
        display={{ lg: 'none' }}
        p="auto"
        onClick={sidebarDisclosure.onToggle}
      />
      <Spacer />
      <IconButton
        aria-label="Notifications"
        variant="ghost"
        fontSize="2xl"
        icon={<RiNotificationLine />}
        size="sm"
      />
      <Divider orientation="vertical" />
      <Button size="sm" fontSize="sm" variant="outline" gap="2.5" px="2">
        <Icon as={RiGasStationLine} fontSize="xl" />
        33
      </Button>
      <LanguageSwitch display={{ base: 'none', md: 'inherit' }} />
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" gap="2" size="sm">
            <Icon as={FaEthereum} fontSize="xl" />
            <chakra.span display={{ base: 'none', md: 'inherit' }}>
              Actions
            </chakra.span>
            <Icon as={FaChevronDown} fontSize="sm" />
          </Button>
        </PopoverTrigger>
        <PopoverContent> wow</PopoverContent>
      </Popover>
      <Button size="sm" fontSize="sm" px="4">
        Connect Wallet
      </Button>
    </Flex>
  )
}
