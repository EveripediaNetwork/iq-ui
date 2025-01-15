import { SidebarItemType } from '@/data/SidebarData'
import { NavIndicator } from '@/components/icons/nav-indicator'
import { Flex, FlexProps, Icon, LinkBox, Image } from '@chakra-ui/react'
import { dataAttr } from '@chakra-ui/utils'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
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
  const isExternalLink = item.route.startsWith('http')

  const renderLinkContent = () => (
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
      position="relative"
      gap="2"
    >
      {typeof item.icon === 'string' ? (
        <Image src={item.icon} boxSize="6" alt="icon" />
      ) : (
        <Icon as={item.icon} boxSize="6" />
      )}
      {t(item.label)}
      {isActiveRoute && (
        <NavIndicator position="absolute" right="0" bg="transparent" />
      )}
    </Flex>
  )

  return (
    <LinkBox {...rest}>
      {isExternalLink ? (
        <Link
          href={item.route}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          {renderLinkContent()}
        </Link>
      ) : (
        <LinkOverlay href={item.route} target={item.target} onClick={onClose}>
          {renderLinkContent()}
        </LinkOverlay>
      )}
    </LinkBox>
  )
}
