import React from 'react'
import { Flex, Heading, Text } from '@chakra-ui/react'

const PageHeader = ({ header, body }: { header: string; body: string }) => {
  return (
    <Flex direction="column" gap="1">
      <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
        {header}
      </Heading>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        color="fadedText4"
        fontWeight="medium"
      >
        {body}
      </Text>
    </Flex>
  )
}

export default PageHeader
