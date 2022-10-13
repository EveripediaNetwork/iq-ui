import { Flex, Text, FlexProps } from '@chakra-ui/react'
import React from 'react'

type StakeCardProps = {
  title: string
  value: string
} & FlexProps

const StakeCard = (props: StakeCardProps) => {
  const { title, value } = props
  return (
    <Flex
      direction="column"
      gap="6px"
      align="center"
      px={{ base: '8px', lg: '10px' }}
      py={{ base: '10px', lg: '7px' }}
      textAlign="center"
      {...props}
    >
      <Text
        fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
        color="tooltipColor"
        fontWeight="medium"
      >
        {title}
      </Text>
      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}>
        {value}{' '}
      </Text>
    </Flex>
  )
}
export default StakeCard
