import React from 'react'
import { Button, Flex, Icon, Text } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import { useNetwork, useAccount } from 'wagmi'
import config from '@/config'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'
import ReceivedInfo from './ReceivedInfo'
import { useTranslations } from 'next-intl'

const LockFormCommon = ({
  hasIQLocked,
  handleLockOrIncreaseAmount,
  handleLockPeriodUpdate,
  isLoading,
  lockend,
  receivedAmount,
  isDisabled = false,
}: {
  hasIQLocked?: boolean
  handleLockOrIncreaseAmount?: () => void
  handleLockPeriodUpdate?: () => void
  isLoading: boolean
  lockend: Date | undefined
  receivedAmount: number
  isDisabled?: boolean
}) => {
  const t = useTranslations('hiiq.stake.stakeIQ')

  const { showToast } = useReusableToast()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const { lockEndDate } = useLockEnd()
  const handleLockButton = () => {
    if (!isConnected || chain?.id !== parseInt(config.chainId)) {
      showToast(
        'Your wallet must not only be connected but also to the right network',
        'error',
      )
      return
    }
    if (handleLockOrIncreaseAmount) {
      handleLockOrIncreaseAmount()
    }

    if (handleLockPeriodUpdate) {
      handleLockPeriodUpdate()
    }
  }

  return (
    <>
      <ReceivedInfo receivedAmount={receivedAmount} />
      <Flex w="full" direction="column" gap="4" fontSize="xs">
        {!hasIQLocked && lockend && (
          <Flex rounded="md" align="center" bg="lightCard" p={2}>
            <Text fontWeight="medium">{t('newLockDate')}</Text>
            <Text fontWeight="semibold" color="brandText" ml="auto">
              {lockend.toDateString()}
            </Text>
          </Flex>
        )}
        {hasIQLocked && typeof lockEndDate !== 'number' && (
          <Flex align="center" w="full">
            <Icon color="brandText" as={RiQuestionLine} mr={1} />
            <Text color="brandText" fontSize={{ base: 'xx-small', md: 'xs' }}>
              {t('lockEndDate')} {lockEndDate?.toDateString()}
            </Text>
          </Flex>
        )}
      </Flex>
      <Button
        isLoading={isLoading}
        w="full"
        onClick={() => handleLockButton()}
        fontSize="xs"
        fontWeight="medium"
        isDisabled={isDisabled}
      >
        {t('lock')}
      </Button>
    </>
  )
}

export default LockFormCommon
