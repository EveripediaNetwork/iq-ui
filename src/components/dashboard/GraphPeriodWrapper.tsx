import { Flex } from '@chakra-ui/layout'
import React, { ReactNode } from 'react'

const GraphPeriodWrapper = ({
  getRootProps,
  children,
}: {
  children: ReactNode
  getRootProps: any
}) => {
  return (
    <Flex
      mt={{ md: '6px' }}
      gap={{ base: '6', md: '10', lg: '12' }}
      {...getRootProps()}
    >
      {children}
    </Flex>
  )
}

export default GraphPeriodWrapper
