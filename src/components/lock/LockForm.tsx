import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { getDollarValue } from '@/utils/LockOverviewUtils'
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
import * as Humanize from 'humanize-plus'
import { useErc20 } from '@/hooks/useErc20'
import { useLock } from '@/hooks/useLock'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReward } from '@/hooks/useReward'
import LockFormCommon from './LockFormCommon'

const LockForm = () => {
  const [iqToBeLocked, setIqToBeLocked] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [trxHash, setTrxHash] = useState()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { userTokenBalance } = useErc20()
  const { lockIQ, increaseLockAmount } = useLock()
  const { userTotalIQLocked } = useLockOverview()
  const { checkPoint } = useReward()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { isConnected } = useAccount()

  const resetValues = () => {
    setLoading(false)
    setIqToBeLocked(0)
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

  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await getDollarValue()
      setExchangeRate(rate)
    }
    if (!exchangeRate) {
      getExchangeRate()
    }
  }, [exchangeRate])

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

  const handleLockIq = async (lockPeriod: number | undefined) => {
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
      if (lockPeriod && typeof lockPeriod === 'number') {
        const result = await lockIQ(iqToBeLocked, lockPeriod)
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

  const formatBalance = (value: number) => {
    const valueToString  = value.toString()
    return valueToString.length > 6 ? Humanize.compactInteger(value, 2) : Humanize.formatNumber(value, 2)
  }

  return (
    <VStack w="full" rowGap={4}>
      <Flex
        w="full"
        p="3"
        pr="5"
        rounded="lg"
        border="solid 1px"
        borderColor="divider"
      >
        <Flex direction="column" gap="1.5">
          <Text color="grayText2" fontSize="xs">
            Send:
          </Text>
          <Flex gap="1" align="center">
            <Input
              variant="unstyled"
              onChange={e => updateIqToBeLocked(e.target.value)}
              w={12}
              placeholder="23.00"
              value={iqToBeLocked}
              disabled={!isConnected}
            />
            <Text color="grayText2" fontSize="xs">
              (~${Humanize.formatNumber(iqToBeLocked * exchangeRate, 2)})
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" ml="auto" align="end" gap="1.5">
          <Flex gap="1" align="center">
            <Text color="grayText2" fontSize="xs">
              Balance: (~{formatBalance(userTokenBalance)})
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
          <Flex gap="1" align="center">
            <BraindaoLogo3 w="6" h="5" />
            <Text fontWeight="medium">IQ</Text>
          </Flex>
        </Flex>
      </Flex>
      <IconButton
        icon={<RiArrowDownLine />}
        aria-label="Swap"
        variant="outline"
        w="fit-content"
        mx="auto"
        color="brandText"
      />
      <Flex direction="column" w="full" gap="3">
        <Flex
          p="3"
          pr="5"
          rounded="lg"
          border="solid 1px"
          borderColor="divider"
        >
          <Flex direction="column" gap="1.5">
            <Text color="grayText2" fontSize="xs">
              Recieve:
            </Text>
            <Flex gap="1" align="center">
              <Text fontWeight="semibold">
                {Humanize.formatNumber(iqToBeLocked, 2)}
              </Text>
              <Text color="grayText2" fontSize="xs">
                (~${Humanize.formatNumber(iqToBeLocked * exchangeRate, 2)})
              </Text>
            </Flex>
          </Flex>
          <Flex ml="auto" align="end" gap="1">
            <BraindaoLogo3 w="6" h="5" />
            <Text fontWeight="medium">HiIQ</Text>
          </Flex>
        </Flex>
      </Flex>
      <LockFormCommon
        hasSlider={!(userTotalIQLocked > 0)}
        isLoading={loading}
        handleLockOrIncreaseAmount={lockPeriod => handleLockIq(lockPeriod)}
        lockAmount={iqToBeLocked}
      />
    </VStack>
  )
}

export default LockForm
