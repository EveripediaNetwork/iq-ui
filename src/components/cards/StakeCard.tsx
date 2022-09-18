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
      px="10px"
      py="7px"
      textAlign="center"
      {...props}
    >
      <Text
        fontSize={{ base: 'xs', lg: 'lg' }}
        color="tooltipColor"
        fontWeight="medium"
      >
        {title}
      </Text>
      <Text fontWeight="semibold" fontSize={{ base: 'md', lg: '2xl' }}>
        {value}{' '}
      </Text>
    </Flex>
  )
}
export default StakeCard
