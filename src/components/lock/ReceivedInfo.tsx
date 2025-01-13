import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { formatValue } from '@/utils/LockOverviewUtils'
import { IQLogo } from '../iq-logo'
import { useTranslations } from 'next-intl'

const ReceivedInfo = ({ receivedAmount }: { receivedAmount: number }) => {
  const t = useTranslations('hiiq.stake.stakeIQ')

  return (
    <Flex direction="column" w="full" gap="3">
      <Flex p="3" pr="5" rounded="lg" border="solid 1px" borderColor="divider">
        <Flex direction="column" gap="1.5">
          <Text color="fadedText4" fontSize="xs" fontWeight="medium">
            {t('receive')}
          </Text>
          <Flex gap="1" align="center">
            <Text fontWeight="semibold">{formatValue(receivedAmount)}</Text>
          </Flex>
        </Flex>
        <Flex ml="auto" align="end" gap="1">
          <IQLogo w="6" h="5" />
          <Text fontWeight="medium">HiIQ</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ReceivedInfo
