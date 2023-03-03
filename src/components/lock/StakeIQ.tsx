import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import {
  calculateReturn,
  getValueFromBigNumber,
  formatValue,
  convertStringValueToBigNumber,
} from '@/utils/LockOverviewUtils'
import {
  Badge,
  Flex,
  IconButton,
  Text,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { RiArrowDownLine } from 'react-icons/ri'
import { useErc20 } from '@/hooks/useErc20'
import { useLock } from '@/hooks/useLock'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReward } from '@/hooks/useReward'
import { Dict } from '@chakra-ui/utils'
import { logEvent } from '@/utils/googleAnalytics'
import { BigNumber } from 'ethers'
import { useLockEnd } from '@/hooks/useLockEnd'
import LockFormCommon from './LockFormCommon'
import LockSlider from '../elements/Slider/LockSlider'

const StakeIQ = ({ exchangeRate }: { exchangeRate: number }) => {
  const [lockEndMemory, setLockEndValueMemory] = useState<Date>()
  const [iqToBeLocked, setIqToBeLocked] = useState<BigNumber>()
  const [userInput, setUserInput] = useState<number>(0)
  const [trxHash, setTrxHash] = useState()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { userTokenBalance } = useErc20()
  const { lockIQ, increaseLockAmount } = useLock()
  const { userTotalIQLocked, refreshTotalIQLocked, refetchUserLockEndDate } =
    useLockOverview()
  const { checkPoint } = useReward()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { isConnected, address } = useAccount()
  const [lockend, setLockend] = useState<Date>()
  const [lockValue, setLockValue] = useState(0)
  const [receivedAmount, setReceivedAmount] = useState(0)
  const { lockEndDate } = useLockEnd()

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
    setIqToBeLocked(BigNumber.from(0))
    setUserInput(0)
    setLockValue(0)
    setTrxHash(undefined)
  }

  useEffect(() => {
    if (trxHash && data) {
      if (data.status) {
        toast({
          title: `IQ successfully locked`,
          position: 'top-right',
          isClosable: true,
          status: 'success',
        })
        checkPoint()
        resetValues()
      } else {
        toast({
          title: `Transaction could not be completed`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
        resetValues()
      }
    }
  }, [data, toast, trxHash, checkPoint])

  const maxIqToBeLocked = (maxValue: BigNumber) => {
    setIqToBeLocked(maxValue)
    setUserInput(getValueFromBigNumber(maxValue))
  }

  const checkIfAmountIsLockable = (amount: BigNumber | undefined) => {
    return amount ? userTokenBalance.gte(amount) : false
  }

  const updateIqToBeLocked = (value: string) => {
    if (value) {
      const convertedInputValue = convertStringValueToBigNumber(value)
      if (checkIfAmountIsLockable(convertedInputValue)) {
        setIqToBeLocked(convertedInputValue)
        setUserInput(getValueFromBigNumber(convertedInputValue))
      } else {
        toast({
          title: `Value cannot be greater than the available balance`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
      }
    } else {
      setIqToBeLocked(BigNumber.from(0))
    }
  }

  const handleLockIq = async () => {
    if (!iqToBeLocked) {
      toast({
        title: `You must specify the amount of IQ to be locked`,
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
      return
    }

    if (
      userTokenBalance.isZero() ||
      !checkIfAmountIsLockable(iqToBeLocked) ||
      iqToBeLocked.isZero()
    ) {
      toast({
        title: `Total Iq to be locked cannot be zero or greater than the available IQ balance`,
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
    }
    if (userTotalIQLocked > 0) {
      setLoading(true)
      try {
        const result = await increaseLockAmount(iqToBeLocked)
        if (!result) {
          toast({
            title: `Transaction failed`,
            position: 'top-right',
            isClosable: true,
            status: 'error',
          })
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
          toast({
            title: `Allowance too small for this transaction`,
            position: 'top-right',
            isClosable: true,
            status: 'error',
          })
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
          toast({
            title: `Transaction cancelled by user`,
            position: 'top-right',
            isClosable: true,
            status: 'error',
          })
        }
        setLoading(false)
      }
    } else {
      setLoading(true)
      if (lockValue && typeof lockValue === 'number') {
        try {
          const result = await lockIQ(iqToBeLocked, lockValue)
          if (!result) {
            toast({
              title: `Transaction failed`,
              position: 'top-right',
              isClosable: true,
              status: 'error',
            })
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
            toast({
              title: `Transaction cancelled by user`,
              position: 'top-right',
              isClosable: true,
              status: 'error',
            })
          }
          setLoading(false)
        }
      } else {
        toast({
          title: `You need to provide a lock period`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
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
              Balance: (~{formatValue(getValueFromBigNumber(userTokenBalance))})
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
            onChange={e => updateIqToBeLocked(e.target.value)}
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
        <LockSlider updateLockend={newDate => updateLockend(newDate)} />
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
