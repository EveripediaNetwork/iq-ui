import React from 'react'
import { LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { Link } from '@/i18n/routing'
import { LinkProps } from 'next/link'

type ChakraLinkAndNextProps = ChakraLinkProps & LinkProps

export const LinkWrapper = ({ href, children }: ChakraLinkAndNextProps) => {
  return <Link href={href}>{children}</Link>
}
