import { BraindaoLogo3 } from '@/components/braindao-logo-3'
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
import { logEvent } from '@/utils/googleAnalytics'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'
import LockFormCommon from './LockFormCommon'
import LockSlider from '../elements/Slider/LockSlider'

const StakeIQ = ({ exchangeRate }: { exchangeRate: number }) => {
  const [lockEndMemory, setLockEndValueMemory] = useState<Date>()
  const [iqToBeLocked, setIqToBeLocked] = useState<bigint>()
  const [userInput, setUserInput] = useState<number>(0)
  const [trxHash, setTrxHash] = useState()
  const [loading, setLoading] = useState(false)
  const { showToast } = useReusableToast()
  const { userTokenBalance } = useErc20()
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

  useEffect(() => {
    const amountToBeRecieved = calculateReturn(
      userTotalIQLocked,
      lockValue,
      lockEndDate,
      userInput,
    )
    setReceivedAmount(amountToBeRecieved)
  }, [userInput, userTotalIQLocked, lockValue])

  useEffect(() => {
    if (!lockend && lockEndDate && typeof lockEndDate !== 'number') {
      setLockend(lockEndDate)
      setLockEndValueMemory(lockEndDate)
    }
  }, [lockEndDate, lockend])

  const updateLockend = (lockPeriodInput: number) => {
    const temp = lockEndMemory || new Date()
    const newDate = new Date(temp)
    if (lockPeriodInput === 0) {
      setLockValue(0)
      return
    }
    newDate.setDate(temp.getUTCDate() + lockPeriodInput)
    setLockend(newDate)
    setLockValue(lockPeriodInput)
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
        showToast('IQ successfully locked', 'success')
        checkPoint()
        resetValues()
      } else {
        showToast('Transaction could not be completed', 'error')
        resetValues()
      }
    }
  }, [data, trxHash, checkPoint])

  const maxIqToBeLocked = (maxValue: bigint) => {
    setIqToBeLocked(maxValue)
    setUserInput(getValueFromBigInt(maxValue))
  }

  const checkIfAmountIsLockable = (amount: bigint | undefined) => {
    return amount ? userTokenBalance > amount : false
  }

  const updateIqToBeLocked = (value: string) => {
    if (value) {
      const convertedInputValue = convertStringValueToBigInt(value)
      if (checkIfAmountIsLockable(convertedInputValue)) {
        setIqToBeLocked(convertedInputValue)
        setUserInput(getValueFromBigInt(convertedInputValue))
      } else {
        showToast('Value cannot be greater than the available balance', 'error')
      }
    } else {
      setIqToBeLocked(BigInt(0))
    }
  }

  const handleLockIq = async () => {
    if (!iqToBeLocked) {
      showToast('You must specify the amount of IQ to be locked', 'error')
      return
    }

    if (
      userTokenBalance === BigInt(0) ||
      !checkIfAmountIsLockable(iqToBeLocked) ||
      iqToBeLocked === BigInt(0)
    ) {
      showToast(
        'Total Iq to be locked cannot be zero or greater than the available IQ balance',
        'error',
      )
    }
    if (userTotalIQLocked > 0) {
      setLoading(true)
      try {
        const result = await increaseLockAmount(iqToBeLocked)
        if (!result) {
          showToast('Transaction failed', 'error')
          logEvent({
            action: 'INCREASE_STAKE_FAILURE',
            label: JSON.stringify(address),
            value: 0,
            category: 'increase_stake_failure',
          })
          setLoading(false)
          return
        }
        if (result === 'ALLOWANCE_ERROR') {
          showToast('Allowance too small for this transaction', 'error')
          setLoading(false)
          return
        }
        logEvent({
          action: 'INCREASE_STAKE_SUCCESS',
          label: JSON.stringify(address),
          value: 1,
          category: 'increase_stake_success',
        })
        setTrxHash(result.hash)
      } catch (err) {
        const errorObject = err as Dict
        if (errorObject?.code === 'ACTION_REJECTED') {
          showToast('Transaction cancelled by user', 'error')
        }
        setLoading(false)
      }
    } else {
      setLoading(true)
      if (lockValue && typeof lockValue === 'number') {
        try {
          const result = await lockIQ(iqToBeLocked, lockValue)
          if (!result) {
            showToast('Transaction failed', 'error')
            logEvent({
              action: 'STAKE_FAILURE',
              label: JSON.stringify(address),
              value: 0,
              category: 'stake_failure',
            })
            setLoading(false)
            return
          }
          logEvent({
            action: 'STAKE_SUCCESS',
            label: JSON.stringify(address),
            value: 1,
            category: 'stake_success',
          })
          setTrxHash(result.hash)
        } catch (err) {
          const errorObject = err as Dict
          if (errorObject?.code === 'ACTION_REJECTED') {
            showToast('Transaction cancelled by user', 'error')
          }
          setLoading(false)
        }
      } else {
        showToast('You need to provide a lock period', 'error')
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
            Send:
          </Text>
          <Flex
            ml="auto"
            direction="row"
            align="space-between"
            textAlign="right"
            gap="1"
          >
            <Text color="fadedText4" fontSize="xs" fontWeight="medium">
              Balance: (~{formatValue(getValueFromBigInt(userTokenBalance))})
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
              MAX
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
            <BraindaoLogo3 w="6" h="5" />
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
