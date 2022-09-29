import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { Flex, Stack, StackProps, Text, Spacer, Box } from '@chakra-ui/react'
import { MAIN_ROUTES, EXTRA_ROUTES } from '@/data/SidebarData'
import { SidebarItem } from '@/components/dashboard/sidebar-item'
import { BraindaoLogo } from '@/components/braindao-logo'
import React from 'react'
import { ColorModeToggle } from '@/components/dashboard/ColorModeToggle'

export const Sidebar = (props: StackProps) => {
  return (
    <Stack w="full" h="full" py="4" spacing="10" overflow="auto" {...props}>
      <Flex
        gap="2"
        align="center"
        px="5"
        pb="4"
        borderBottom="solid 1px"
        borderColor={{ base: 'divider', md: 'transparent' }}
      >
        <BraindaoLogo />
        <Text fontWeight="bold" fontSize="lg">
          BrainDAO
        </Text>
        <LanguageSwitch ml="auto" display={{ md: 'none' }} />
        <ColorModeToggle display={{ base: 'flex', md: 'none' }} />
      </Flex>
      <Stack flex="auto">
        {MAIN_ROUTES.map((item, id) => (
          <SidebarItem item={item} key={id} />
        ))}
        <Spacer />
        <Box h="15" />
        {EXTRA_ROUTES.map((item, id) => (
          <SidebarItem item={item} key={id} />
        ))}
      </Stack>
    </Stack>
  )
}
