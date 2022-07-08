import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { SidebarItem } from '@/components/dashboard/sidebar-item'
import { EXTRA_ROUTES, MAIN_ROUTES } from '@/data/SidebarData'
import { Logo } from '@/components/logo'
import { Flex, Spacer, Stack, StackProps, Text } from '@chakra-ui/react'
import React from 'react'

export const Sidebar = (props: StackProps) => {
  return (
    <Stack w="full" h="full" py="4" spacing="10" {...props}>
      <Flex
        gap="2"
        align="center"
        px="5"
        borderBottom="solid 1px"
        borderColor={{ base: 'whiteAlpha.200', md: 'transparent' }}
      >
        <Logo />
        <Text fontWeight="bold" fontSize="lg">
          Everipedia
        </Text>
        <LanguageSwitch ml="auto" display={{ md: 'none' }} />
      </Flex>
      <Stack flex="auto">
        {/* {MAIN_ROUTES.map((item, id) => (
          <SidebarItem item={item} key={id} />
        ))}
        <Spacer />
        {EXTRA_ROUTES.map((item, id) => (
          <SidebarItem item={item} key={id} />
        ))} */}
      </Stack>
    </Stack>
  )
}
