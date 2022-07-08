import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

export const Dot = (props: IconProps) => {
  return (
    <Icon
      width="5px"
      height="4px"
      viewBox="0 0 5 4"
      fill="currentColor"
      {...props}
    >
      <circle cx="2.5" cy="2" r="2" fill="white" fillOpacity="0.64" />
    </Icon>
  )
}
