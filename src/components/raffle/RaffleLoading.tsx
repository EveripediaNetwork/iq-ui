import { Flex, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { RaffleEmptyState } from '../illustrations/RaffleEmptyState'

const RaffleLoading = () => {
  const { colorMode } = useColorMode()
  return (
    <Flex direction="column" gap="10" textAlign="center" align="center" mt="16">
      <RaffleEmptyState colorMode={colorMode} />
      <Text maxW={{ md: '55%' }} fontWeight="medium">
        There is no raffle at the moment. Check back again to see raffle results
        and wins.
      </Text>
    </Flex>
  )
}

export default RaffleLoading
