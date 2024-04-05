import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

const ArrowIcon = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 21 20" {...props}>
      <title>Arrow</title>
      <path
        d="M17.6319 10.3536C17.8271 10.1583 17.8271 9.84171 17.6319 9.64645L14.4499 6.46447C14.2546 6.2692 13.938 6.2692 13.7428 6.46447C13.5475 6.65973 13.5475 6.97631 13.7428 7.17157L16.5712 10L13.7428 12.8284C13.5475 13.0237 13.5475 13.3403 13.7428 13.5355C13.938 13.7308 14.2546 13.7308 14.4499 13.5355L17.6319 10.3536ZM3.27832 10.5H17.2783V9.5H3.27832V10.5Z"
        fill="#FF1A88"
      />
    </Icon>
  )
}

export default ArrowIcon
