import React, { useState, useEffect } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { formatValue, getDollarValue } from '@/utils/LockOverviewUtils'

const ReceivedInfo = ({ receivedAmount }: { receivedAmount: number }) => {
  const [exchangeRate, setExchangeRate] = useState(0)
  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await getDollarValue()
      setExchangeRate(rate)
    }
    if (!exchangeRate) {
      getExchangeRate()
    }
  }, [exchangeRate])

  return (
    <Flex direction="column" w="full" gap="3">
      <Flex p="3" pr="5" rounded="lg" border="solid 1px" borderColor="divider">
        <Flex direction="column" gap="1.5">
          <Text color="grayText2" fontSize="xs">
            Recieve:
          </Text>
          <Flex gap="1" align="center">
            <Text fontWeight="semibold">{formatValue(receivedAmount)}</Text>
            <Text color="grayText2" fontSize="xs">
              (~${formatValue(receivedAmount * exchangeRate)})
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