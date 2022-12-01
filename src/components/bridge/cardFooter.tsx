import React, { Flex, Text } from '@chakra-ui/react'
import { Token, TokenId } from '@/types/bridge'

type CardFooterType = {
  selectedToken: Token
}

const CardFooter = ({ selectedToken }: CardFooterType) => (
  <Flex direction="column" gap="4" fontSize="sm">
    <Flex align="center">
      <Text color="fadedText4" fontWeight="medium">
        Estimated transfer time{' '}
      </Text>
      <Text fontWeight="semibold" ml="auto">
        ~{selectedToken.to.id === TokenId.IQ ? 2 : 5}min
      </Text>
    </Flex>
    {selectedToken.to.id !== TokenId.IQ ? (
      <Flex align="center">
        <Text color="fadedText4" fontWeight="medium">
          Platform Fee
        </Text>
        <Text fontWeight="semibold" ml="auto">
          0.25%
        </Text>
      </Flex>
    ) : null}
  </Flex>
)

export default CardFooter
