import { SidebarItemType } from '@/data/SidebarData'
import { NavIndicator } from '@/components/icons/nav-indicator'
import { Flex, FlexProps, Icon, Image } from '@chakra-ui/react'
import { dataAttr } from '@chakra-ui/utils'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React from 'react'

type SidebarItemProps = { item: SidebarItemType } & FlexProps
export const SidebarItem = (props: SidebarItemProps) => {
  const { item, ...rest } = props

  const { pathname } = useRouter()
  return (
    <NextLink href={item.route} passHref>
      <Flex
        h="40px"
        align="center"
        pl="15"
        gap="18px"
        cursor="pointer"
        data-active={dataAttr(pathname === item.route)}
        _hover={{
          bg: 'whiteAlpha.200',
        }}
        _active={{
          bg: 'hoverBg',
          color: 'brand.500',
        }}
        transition="background .2s ease"
        role="group"
        {...rest}
        color="gray.500"
      >
        {item.type === 'ICON' ? (
          <Icon as={item.icon} boxSize="6" />
        ) : (
          <Image src={item.image} h="6" w="6" />
        )}
        <span>{item.label}</span>
        <NavIndicator
          display="none"
          _groupActive={{
            display: 'inherit',
          }}
          ml="auto"
        />
      </Flex>
    </NextLink>
  )
}
