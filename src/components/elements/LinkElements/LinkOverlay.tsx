import { LinkProps } from 'next/link'
import {
  LinkProps as ChakraLinkProps,
  LinkOverlay as ChakraLinkOverlay,
} from '@chakra-ui/react'
import React from 'react'
import { LinkWrapper } from './LinkWrapper'

type ChakraLinkAndNextProps = ChakraLinkProps & LinkProps

const LinkOverlay = ({
  href,
  prefetch,
  children,
  ...props
}: ChakraLinkAndNextProps) => {
  return (
    <LinkWrapper href={href}>
      <ChakraLinkOverlay prefetch={prefetch} {...props}>
        {children}
      </ChakraLinkOverlay>
    </LinkWrapper>
  )
}

export default LinkOverlay
