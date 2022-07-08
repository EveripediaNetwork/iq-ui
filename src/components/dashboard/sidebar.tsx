import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { Logo } from '@/components/logo'
import { Flex, Stack, StackProps, Text, Spacer } from '@chakra-ui/react'
import { MAIN_ROUTES, EXTRA_ROUTES } from '@/data/SidebarData'
import React from 'react'
import { SidebarItem } from './sidebar-item'

export const Sidebar = (props: StackProps) => {
  return (
    <Stack w="full" h="full" py="4" spacing="10" {...props} borderRight="solid 1px" borderColor="gray.200">
      <Flex
        gap="2"
        align="center"
        px="5"
        py="3"
        borderBottom="solid 1px"
        borderColor={{ base: 'gray.200', md: 'transparent' }}
      >
        <Logo />
        <Text fontWeight="bold" fontSize="lg">
          Everipedia
        </Text>
        <LanguageSwitch ml="auto" display={{ md: 'none' }} />
      </Flex>
      <Stack flex="auto">
        {MAIN_ROUTES.map((item, id) => (
          <SidebarItem item={item} key={id} />
        ))}
        <Spacer />
        {EXTRA_ROUTES.map((item, id) => (
          <SidebarItem item={item} key={id} />
        ))}
      </Stack>
    </Stack>
  )
}
