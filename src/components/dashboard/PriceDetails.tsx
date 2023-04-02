import React from 'react'
import { chakra, Skeleton } from '@chakra-ui/react'
import { Dict } from '@chakra-ui/utils'
import { compareValues } from '@/utils/dashboard-utils'

const PriceDetails = ({
  graphData,
  position,
}: {
  graphData: Dict<number>[] | undefined
  position: 'HIGHEST' | 'LOWEST'
}) => {
  return (
    <chakra.span
      fontSize={{ base: '12px', md: '14px', lg: '16px' }}
      fontWeight="500"
      color="fadedText2"
      ml="auto"
    >
      {graphData !== undefined ? (
        `$${compareValues(
          graphData?.[graphData.length - 1].amt,
          graphData?.[0].amt,
          position,
        ).toFixed(4)}`
      ) : (
        <Skeleton h="3.5" w={{ xl: '24', base: '15' }} borderRadius="full" />
      )}
    </chakra.span>
  )
}

export default PriceDetails
