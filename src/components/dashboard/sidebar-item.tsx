import { SidebarItemType } from '@/data/SidebarData'
import { NavIndicator } from '@/components/icons/nav-indicator'
import {
  Flex,
  FlexProps,
  Icon,
  LinkOverlay,
  LinkBox,
  Image,
} from '@chakra-ui/react'
import { dataAttr } from '@chakra-ui/utils'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React from 'react'

type SidebarItemProps = { item: SidebarItemType } & FlexProps
export const SidebarItem = (props: SidebarItemProps) => {
  const { item, ...rest } = props
  const { pathname } = useRouter()
  return (
    <LinkBox>
      <Flex
        h="40px"
        align="center"
        pl={{ base: 5, lg: '15' }}
        gap="18px"
        cursor="pointer"
        data-active={dataAttr(pathname === item.route)}
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
        {...rest}
      >
        {typeof item.icon === 'string' ? (
          <Image src={item.icon} boxSize="6" />
        ) : (
          <Icon as={item.icon} boxSize="6" />
        )}
        <NextLink href={item.route} passHref>
          <LinkOverlay>{item.label}</LinkOverlay>
        </NextLink>
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
