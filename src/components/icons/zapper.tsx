import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

export const Zapper = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 54 54" fill="none" {...props}>
      <path
        d="M54 27C54 12.0883 41.9117 0 27 0C12.0883 0 0 12.0883 0 27C0 41.9117 12.0883 54 27 54C41.9117 54 54 41.9117 54 27Z"
        fill="#784FFE"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6682 20.2901L35.705 20.1963L31.1473 27.0651L41.9037 27.013L37.3452 33.7667L18.185 33.8893L22.8147 27.0687L12.0957 27.0645L16.6682 20.2901Z"
        fill="white"
      />
    </Icon>
  )
}
