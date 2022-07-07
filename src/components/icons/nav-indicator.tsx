import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

export const NavIndicator = (props: IconProps) => {
  return (
    <Icon
      w="4px"
      h="46px"
      viewBox="0 0 4 46"
      fill="currentColor"
      color="brand.800"
      {...props}
    >
      <path d="M0 4C0 1.79086 1.79086 0 4 0V46C1.79086 46 0 44.2091 0 42V4Z" />
    </Icon>
  )
}
