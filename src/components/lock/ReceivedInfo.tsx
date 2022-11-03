import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { formatValue } from '@/utils/LockOverviewUtils'
import { useIQRate } from '@/hooks/useRate'

const ReceivedInfo = ({ receivedAmount }: { receivedAmount: number }) => {
  const { rate: exchangeRate } = useIQRate()
  return (
    <Flex direction="column" w="full" gap="3">
      <Flex p="3" pr="5" rounded="lg" border="solid 1px" borderColor="divider">
        <Flex direction="column" gap="1.5">
          <Text color="fadedText4" fontSize="xs" fontWeight="medium">
            Receive:
          </Text>
          <Flex gap="1" align="center">
            <Text fontWeight="semibold">{formatValue(receivedAmount)}</Text>
            <Text color="fadedText4" fontSize="xs" fontWeight="medium">
              (~{formatValue(receivedAmount * exchangeRate)})
            </Text>
          </Flex>
        </Flex>
        <Flex ml="auto" align="end" gap="1">
          <BraindaoLogo3 w="6" h="5" />
          <Text fontWeight="medium">HiIQ</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ReceivedInfo
