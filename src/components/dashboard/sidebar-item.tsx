import { SidebarItemType } from '@/data/SidebarData'
import { NavIndicator } from '@/components/icons/nav-indicator'
import { Flex, FlexProps, Icon, LinkBox, Image } from '@chakra-ui/react'
import { dataAttr } from '@chakra-ui/utils'
import { usePathname } from 'next/navigation'
import React from 'react'
import LinkOverlay from '../elements/LinkElements/LinkOverlay'
import { useTranslations } from 'next-intl'

type SidebarItemProps = {
  className?: string
  onClose: () => void
  item: SidebarItemType
} & FlexProps

export const SidebarItem = (props: SidebarItemProps) => {
  const { onClose, item, ...rest } = props

  const t = useTranslations('sidebar')

  const pathname = usePathname()
  const isActiveRoute = pathname?.endsWith(item.route)

  return (
    <LinkBox {...rest}>
      <Flex
        h="40px"
        align="center"
        pl={{ base: 5, lg: '15' }}
        cursor="pointer"
        data-active={dataAttr(isActiveRoute)}
        color="grayText"
        fontWeight="medium"
        _hover={{
          bg: 'divider',
          color: 'dimmedText',
        }}
        _active={{
          bg: 'hoverBg',
          color: 'brandText',
        }}
        transition="all .2s ease"
        role="group"
      >
        <LinkOverlay
          href={item.route}
          target={item.target}
          onClick={onClose}
          display="flex"
          gap="2"
        >
          {typeof item.icon === 'string' ? (
            <Image src={item.icon} boxSize="6" alt="icon" />
          ) : (
            <Icon as={item.icon} boxSize="6" />
          )}
          {t(item.label)}
        </LinkOverlay>
        <NavIndicator
          display="none"
          _groupActive={{
            display: 'inherit',
          }}
          ml="auto"
        />
      </Flex>
    </LinkBox>
  )
}
