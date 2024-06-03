import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { IQButton } from '@/components/dashboard/IQButton'
import {
  Flex,
  Stack,
  StackProps,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import { MAIN_ROUTES, EXTRA_ROUTES } from '@/data/SidebarData'
import { SidebarItem } from '@/components/dashboard/sidebar-item'
import React from 'react'
import { ColorModeToggle } from '@/components/dashboard/ColorModeToggle'
import Link from '../elements/LinkElements/Link'

type SidebarProps = { onClose: () => void } & StackProps

export const Sidebar = (props: SidebarProps) => {
  const { onClose, ...rest } = props

  const logoSrc = useColorModeValue(
    'braindao-logo-light.svg',
    'braindao-logo-dark.svg',
  )

  return (
    <Stack w="full" h="full" py="4" overflow="auto" {...rest}>
      <Flex
        gap="2"
        align="center"
        px="3"
        pb="4"
        borderBottom="solid 1px"
        borderColor={{ base: 'divider', md: 'transparent' }}
      >
        <Link href="https://braindao.org/" target="_blank" mx="auto">
          <Image src={`/svgs/${logoSrc}`} alt="braindao logo" />
        </Link>
        <IQButton ml="auto" gap={1} display={{ md: 'none' }} />
        <LanguageSwitch display={{ md: 'none' }} />
        <ColorModeToggle display={{ base: 'flex', md: 'none' }} />
      </Flex>
      <Stack flex="auto">
        {[...MAIN_ROUTES, ...EXTRA_ROUTES].map((item, id) => (
          <SidebarItem
            onClose={onClose}
            item={item}
            mt={id === MAIN_ROUTES.length ? 'auto !important' : 'unset'}
            key={id}
          />
        ))}
      </Stack>
    </Stack>
  )
}
