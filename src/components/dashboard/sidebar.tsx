import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { Flex, Stack, Text, Spacer, Box, StackProps } from '@chakra-ui/react'
import { MAIN_ROUTES, EXTRA_ROUTES } from '@/data/SidebarData'
import { SidebarItem } from '@/components/dashboard/sidebar-item'
import { BraindaoLogo } from '@/components/braindao-logo'
import React from 'react'
import { ColorModeToggle } from '@/components/dashboard/ColorModeToggle'

type SidebarProps = { onClose: () => void } & StackProps

export const Sidebar = (props: SidebarProps) => {
  const { onClose, ...rest } = props

  return (
    <Stack w="full" h="full" py="4" spacing="10" overflow="auto" {...rest}>
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
          <SidebarItem onClose={onClose} item={item} key={id} />
        ))}
        <Box h="15"  pt={{ md: "40%"}}/>
        {EXTRA_ROUTES.map((item, id) => (
          <SidebarItem onClose={onClose} item={item} key={id} />
        ))}
      </Stack>
    </Stack>
  )
}
