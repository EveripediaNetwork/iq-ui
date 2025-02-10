import {
  calculateReturn,
  getValueFromBigInt,
  formatValue,
  convertStringValueToBigInt,
} from '@/utils/LockOverviewUtils'
import { Badge, Flex, IconButton, Text, Input, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { RiArrowDownLine } from 'react-icons/ri'
import { useErc20 } from '@/hooks/useErc20'
import { useLock } from '@/hooks/useLock'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReward } from '@/hooks/useReward'
import { Dict } from '@chakra-ui/utils'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'
import LockFormCommon from './LockFormCommon'
import LockSlider from '../elements/Slider/LockSlider'
import { usePostHog } from 'posthog-js/react'
import { IQLogo } from '../iq-logo'
import { useTranslations } from 'next-intl'

const StakeIQ = ({ exchangeRate }: { exchangeRate: number }) => {
  const [iqToBeLocked, setIqToBeLocked] = useState<bigint>()
  const [userInput, setUserInput] = useState<number>(0)
  const [trxHash, setTrxHash] = useState<`0x${string}`>()
  const [loading, setLoading] = useState(false)
  const { showToast } = useReusableToast()
  const { userTokenBalance } = useErc20()
  console.log('userTokenBalance', userTokenBalance)
  const { lockIQ, increaseLockAmount } = useLock()
  const { userTotalIQLocked, refreshTotalIQLocked, refetchUserLockEndDate } =
    useLockOverview()
  const { lockEndDate } = useLockEnd()
  const { checkPoint } = useReward()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { isConnected, address } = useAccount()
  const [lockend, setLockend] = useState<Date>()
  const [lockValue, setLockValue] = useState(0)
  const [receivedAmount, setReceivedAmount] = useState(0)
  const posthog = usePostHog()

  const t = useTranslations('hiiq.stake.stakeIQ')

  useEffect(() => {
    const amountToBeRecieved = calculateReturn(
      userTotalIQLocked,
      lockValue,
      lockEndDate,
      userInput,
    )
    setReceivedAmount(amountToBeRecieved)
  }, [userInput, userTotalIQLocked, lockValue, lockEndDate])

  useEffect(() => {
    if (!lockend && lockEndDate && typeof lockEndDate !== 'number') {
      setLockend(lockEndDate)
    }
  }, [lockEndDate, lockend])

  const updateLockend = (lockPeriodInput: number) => {
    if (!lockEndDate) {
      const temp = new Date()
      if (lockPeriodInput === 0) {
        setLockValue(0)
        return
      }
      temp.setDate(temp.getUTCDate() + lockPeriodInput)
      setLockend(temp)
      setLockValue(lockPeriodInput)
    }
  }

  const resetValues = () => {
    refreshTotalIQLocked()
    refetchUserLockEndDate()
    setLoading(false)
    setIqToBeLocked(BigInt(0))
    setUserInput(0)
    setLockValue(0)
    setTrxHash(undefined)
  }

  useEffect(() => {
    if (trxHash && data) {
      if (data.status) {
        showToast(t('transactionMessages.success'), 'success')
        checkPoint()
        resetValues()
      } else {
        showToast(t('transactionMessages.failed1'), 'error')
        resetValues()
      }
    }
  }, [data, trxHash])

  const maxIqToBeLocked = (maxValue: bigint) => {
    setIqToBeLocked(maxValue)
    setUserInput(getValueFromBigInt(maxValue))
  }

  const checkIfAmountIsLockable = (amount: bigint | undefined) => {
    return amount ? userTokenBalance >= amount : false
  }

  const updateIqToBeLocked = (value: string) => {
    if (value) {
      const convertedInputValue = convertStringValueToBigInt(value)
      if (checkIfAmountIsLockable(convertedInputValue)) {
        setIqToBeLocked(convertedInputValue)
        setUserInput(getValueFromBigInt(convertedInputValue))
      } else {
        showToast(t('transactionMessages.balanceExceeded'), 'error')
      }
    } else {
      setIqToBeLocked(BigInt(0))
    }
  }

  const handleLockIq = async () => {
    if (!iqToBeLocked) {
      showToast(t('transactionMessages.specifyAmount'), 'error')
      return
    }

    if (
      userTokenBalance === BigInt(0) ||
      !checkIfAmountIsLockable(iqToBeLocked) ||
      iqToBeLocked === BigInt(0)
    ) {
      showToast(t('transactionMessages.invalidAmount'), 'error')
      return
    }
    if (userTotalIQLocked > 0) {
      setLoading(true)
      try {
        const result = await increaseLockAmount(iqToBeLocked)
        if (!result) {
          showToast(t('failed2'), 'error')

          posthog.capture('INCREASE_STAKE_FAILURE', {
            action: 'INCREASE_STAKE_FAILURE',
            userId: address,
            category: 'increase_stake_failure',
          })
          setLoading(false)
          return
        }
        if (result === 'ALLOWANCE_ERROR') {
          showToast(t('transactionMessages.allowanceError'), 'error')
          setLoading(false)
          return
        }
        posthog.capture('INCREASE_STAKE_SUCCESS', {
          action: 'INCREASE_STAKE_SUCCESS',
          userId: address,
          category: 'increase_stake_success',
        })
        setTrxHash(result.hash)
      } catch (err) {
        const errorObject = err as Dict
        if (errorObject?.code === 'ACTION_REJECTED') {
          showToast(t('transactionMessages.cancelled'), 'error')
        }
        setLoading(false)
      }
    } else {
      setLoading(true)
      if (lockValue && typeof lockValue === 'number') {
        try {
          const result = await lockIQ(iqToBeLocked, lockValue)
          if (!result) {
            showToast(t('transactionMessages.failed2'), 'error')
            posthog.capture('STAKE_FAILURE', {
              action: 'STAKE_FAILURE',
              userId: address,
              category: 'stake_failure',
            })
            setLoading(false)
            return
          }
          if (result === 'ALLOWANCE_ERROR') {
            showToast(t('transactionMessages.allowanceError'), 'error')
            setLoading(false)
            return
          }
          posthog.capture('STAKE_SUCCESS', {
            action: 'STAKE_SUCCESS',
            userId: address,
            category: 'stake_success',
          })

          setTrxHash(result.hash)
        } catch (err) {
          const errorObject = err as Dict
          if (errorObject?.code === 'ACTION_REJECTED') {
            showToast(t('transactionMessages.cancelled'), 'error')
          }
          setLoading(false)
        }
      } else {
        showToast(t('transactionMessages.provideLockPeriod'), 'error')
        setLoading(false)
      }
    }
  }

  return (
    <VStack w="full" rowGap={4}>
      <VStack
        w="full"
        p="3"
        pr="5"
        rounded="lg"
        border="solid 1px"
        borderColor="divider"
        gap={2}
      >
        <Flex align="center" gap="2.5" w="full">
          <Text color="fadedText4" fontSize="xs" fontWeight="medium">
            {t('send')}:
          </Text>
          <Flex
            ml="auto"
            direction="row"
            align="space-between"
            textAlign="right"
            gap="1"
          >
            <Text color="fadedText4" fontSize="xs" fontWeight="medium">
              {t('balance')}: (~
              {formatValue(getValueFromBigInt(userTokenBalance))})
            </Text>
            <Badge
              onClick={() => maxIqToBeLocked(userTokenBalance)}
              variant="solid"
              bg="brand.50"
              color="brandText"
              _dark={{
                bg: 'brand.200',
              }}
              colorScheme="brand"
              rounded="md"
              fontWeight="medium"
              cursor="pointer"
            >
              {t('max')}
            </Badge>
          </Flex>
        </Flex>
        <Flex align="center" gap="2.5" w="full">
          <Input
            variant="unstyled"
            onChange={(e) => updateIqToBeLocked(e.target.value)}
            placeholder="23.00"
            value={userInput}
            color="fadedText4"
            disabled={!isConnected}
            fontSize="lg"
            fontWeight="semibold"
            display="inline-block"
            w={`min(${(userInput.toString().length + 2.3) * 9}px,50%)`}
          />
          <Text color="fadedText4" fontSize="xs" fontWeight="medium">
            (~${formatValue(userInput * exchangeRate)})
          </Text>
          <Flex
            ml="auto"
            direction="row"
            align="space-between"
            textAlign="right"
            gap="1"
          >
            <IQLogo w="6" h="5" />
            <Text fontWeight="medium">IQ</Text>
          </Flex>
        </Flex>
      </VStack>
      {userTotalIQLocked < 1 && (
        <LockSlider updateLockend={(newDate) => updateLockend(newDate)} />
      )}
      <IconButton
        icon={<RiArrowDownLine />}
        aria-label="Swap"
        variant="outline"
        w="fit-content"
        mx="auto"
        color="brandText"
      />

      <LockFormCommon
        isLoading={loading}
        handleLockOrIncreaseAmount={handleLockIq}
        lockend={lockend}
        hasIQLocked={userTotalIQLocked > 0}
        receivedAmount={receivedAmount}
      />
    </VStack>
  )
}

export default StakeIQ
