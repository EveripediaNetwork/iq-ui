import { SimpleGrid } from '@chakra-ui/layout'
import React from 'react'

const StakeOverviewWrapper = ({children}: {children: JSX.Element}) => {
  return (
    <SimpleGrid
      columns={{ base: 2, md: 4 }}
      px={{ base: '2' }}
      py="3"
      mt="1"
      spacingY="13px"
      border="solid 1px"
      borderColor="divider"
      rounded="lg"
      bg="lightCard"
    >
        {children}
    </SimpleGrid>
  )
}

export default StakeOverviewWrapper
