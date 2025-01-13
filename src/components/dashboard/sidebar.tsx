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
import { Link } from '@/i18n/routing'

type SidebarProps = { onClose: () => void } & StackProps

export const Sidebar = (props: SidebarProps) => {
  const { onClose, ...rest } = props

  const logoSrc = useColorModeValue('iq-logo-light.svg', 'iq-logo-dark.svg')

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
        <Link href="/" className="mx-auto">
          <Image src={`/svgs/${logoSrc}`} alt="iq logo" />
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
            className={id === MAIN_ROUTES.length ? 'mt-auto' : 'unset'}
            key={id}
          />
        ))}
      </Stack>
    </Stack>
  )
}
