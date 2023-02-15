import { Divider, Heading, VStack } from '@chakra-ui/layout'
import React from 'react'

const StakeHeader = ({title}: {title: string}) =>  {
  return (
    <VStack align="center" rowGap={2}>
        <Heading fontWeight="medium" fontSize={{ md: 'xl', lg: '2xl' }}>
          {title}
        </Heading>
        <Divider
          w="30"
          borderColor="divider"
          display={{ base: 'none', lg: 'inherit' }}
        />
      </VStack>
  )
}

export default StakeHeader
