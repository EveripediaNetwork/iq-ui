import React from 'react'
import { Button, Flex, Icon, Text, useToast } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useNetwork, useAccount } from 'wagmi'
import config from '@/config'
import ReceivedInfo from './ReceivedInfo'

const LockFormCommon = ({
  hasIQLocked,
  handleLockOrIncreaseAmount,
  handleLockPeriodUpdate,
  isLoading,
  lockend,
  receivedAmount,
}: {
  hasIQLocked?: boolean
  handleLockOrIncreaseAmount?: () => void
  handleLockPeriodUpdate?: () => void
  isLoading: boolean
  lockend: Date | undefined
  receivedAmount: number
}) => {
  const { lockEndDate } = useLockOverview()
  const toast = useToast()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()

  const handleLockButton = () => {
    if (!isConnected || chain?.id !== parseInt(config.chainId)) {
      toast({
        title: `Your wallet must not only be connected but also to the right network`,
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
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
            <Text fontWeight="medium">New lock date </Text>
            <Text fontWeight="semibold" color="brandText" ml="auto">
              {lockend.toDateString()}
            </Text>
          </Flex>
        )}
        {hasIQLocked && typeof lockEndDate !== 'number' && (
          <Flex align="center" w="full">
            <Icon color="brandText" as={RiQuestionLine} mr={1} />
            <Text color="brandText" fontSize={{ base: 'xx-small', md: 'xs' }}>
              Your lock end date will be {lockEndDate.toDateString()}
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
      >
        Lock
      </Button>
    </>
  )
}

export default LockFormCommon
