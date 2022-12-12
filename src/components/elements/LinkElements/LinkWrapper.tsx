import React from 'react'
import { LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import NextLink, { LinkProps } from 'next/link'

type ChakraLinkAndNextProps = ChakraLinkProps & LinkProps

export const LinkWrapper = ({ href, children }: ChakraLinkAndNextProps) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      {children}
    </NextLink>
  )
}
