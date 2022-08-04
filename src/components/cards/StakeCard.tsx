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
      px="13px"
      py="7px"
      textAlign="center"
      {...props}
    >
      <Text fontSize="xs" color="grayText">
        {title}
      </Text>
      <Text fontWeight="semibold">{value}</Text>
    </Flex>
  )
}
export default StakeCard
