import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

export const Ethereum = (props: IconProps) => {
  return (
    <Icon width="13px" height="22px" viewBox="0 0 13 22" fill="none" {...props}>
      <path d="M6 0L0 11L6 8V0Z" fill="#8A92B2" />
      <path d="M6 8L0 11L6 15V8Z" fill="#62688F" />
      <path d="M12 11L6 0V8L12 11Z" fill="#62688F" />
      <path d="M6 15L12 11L6 8V15Z" fill="#454A75" />
      <path d="M0 12L6 22V16L0 12Z" fill="#8A92B2" />
      <path d="M6 16V22L13 12L6 16Z" fill="#62688F" />
    </Icon>
  )
}
