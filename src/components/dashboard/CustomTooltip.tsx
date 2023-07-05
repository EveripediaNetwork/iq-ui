import React from 'react'
import { Dict } from '@chakra-ui/utils'
import { Box, Text } from '@chakra-ui/layout'

const CustomTooltip = ({ active, payload, isPrice = true }: Dict) => {
  if (active && payload && payload.length) {
    return (
      <Box position="relative" p={2} rounded="lg">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="white"
          rounded="lg"
          opacity={0.3}
        />
        {isPrice ? (
          <>
            <b>Price:</b> {`$${payload[0].value.toFixed(6)}`}
          </>
        ) : (
          <>
            <Text fontWeight="bold" fontSize="sm">
              IQ Staked: 1,200 IQ
            </Text>
            <Text fontSize="sm">July 3, 2023</Text>
          </>
        )}
      </Box>
    )
  }

  return null
}

export default CustomTooltip
