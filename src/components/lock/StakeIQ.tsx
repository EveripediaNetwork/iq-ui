import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { calculateReturn, formatValue } from '@/utils/LockOverviewUtils'
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
import LockFormCommon from './LockFormCommon'
import LockSlider from '../elements/Slider/LockSlider'

const StakeIQ = ({ exchangeRate }: { exchangeRate: number }) => {
  const [lockEndMemory, setLockEndValueMemory] = useState<Date>()
  const [iqToBeLocked, setIqToBeLocked] = useState(0)
  const [trxHash, setTrxHash] = useState()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { userTokenBalance } = useErc20()
  const { lockIQ, increaseLockAmount } = useLock()
  const { userTotalIQLocked, lockEndDate } = useLockOverview()
  const { checkPoint } = useReward()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { isConnected } = useAccount()
  const [lockend, setLockend] = useState<Date>()
  const [lockValue, setLockValue] = useState(0)
  const [receivedAmount, setReceivedAmount] = useState(0)

  useEffect(() => {
    const amountToBeRecieved = calculateReturn(
      userTotalIQLocked,
      lockValue,
      lockEndDate,
      iqToBeLocked,
    )
    setReceivedAmount(amountToBeRecieved)
  }, [iqToBeLocked, userTotalIQLocked, lockValue])

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
    setLoading(false)
    setIqToBeLocked(0)
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

  const updateIqToBeLocked = (value: string | number) => {
    if (value) {
      const convertedValue = typeof value === 'string' ? parseInt(value) : value
      if (convertedValue <= userTokenBalance) {
        setIqToBeLocked(typeof value === 'string' ? parseInt(value) : value)
      } else {
        toast({
          title: `Value cannot be greater than the available balance`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
      }
    }
  }

  const handleLockIq = async () => {
    if (userTokenBalance < iqToBeLocked || iqToBeLocked < 1) {
      toast({
        title: `Total Iq to be locked cannot be zero or greater than the available IQ balance`,
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
      return
    }
    if (userTotalIQLocked > 0) {
      setLoading(true)
      const result = await increaseLockAmount(iqToBeLocked)
      if (!result) {
        toast({
          title: `Transaction failed`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
        setLoading(false)
      }
      setTrxHash(result.hash)
    } else {
      setLoading(true)
      if (lockValue && typeof lockValue === 'number') {
        const result = await lockIQ(iqToBeLocked, lockValue)
        if (!result) {
          toast({
            title: `Transaction failed`,
            position: 'top-right',
            isClosable: true,
            status: 'error',
          })
          setLoading(false)
        }
        setTrxHash(result.hash)
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
          <Text color="grayText2" fontSize="xs">
            Send:
          </Text>
          <Flex
            ml="auto"
            direction="row"
            align="space-between"
            textAlign="right"
            gap="1"
          >
            <Text color="grayText2" fontSize="xs">
              Balance: (~{formatValue(userTokenBalance)})
            </Text>
            <Badge
              onClick={() => updateIqToBeLocked(userTokenBalance)}
              variant="solid"
              bg="brand.50"
              color="brandText"
              _dark={{
                bg: 'brand.200',
              }}
              colorScheme="brand"
              rounded="md"
              fontWeight="normal"
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
            value={iqToBeLocked}
            disabled={!isConnected}
            display="inline-block"
            w={`min(${(iqToBeLocked.toString().length + 1.8) * 7}px,50%)`}
          />
          <Text color="grayText2" fontSize="xs">
            (~${formatValue(iqToBeLocked * exchangeRate)})
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
