import { SimpleGrid, GridItem } from '@chakra-ui/react'
import React from 'react'

const ComponentWrapper = ({ children }: { children: JSX.Element }) => {
  return (
    <GridItem
      colSpan={[2]}
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      py={{ base: '13px', md: '22px', lg: '6' }}
      px={{ base: '11px', md: '18px', lg: 5 }}
    >
      {children}
    </GridItem>
  )
}

export default ComponentWrapper
