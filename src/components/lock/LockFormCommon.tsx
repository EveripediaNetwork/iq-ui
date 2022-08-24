import React, { useState, useEffect } from 'react'
import {
  Button,
  Flex,
  Icon,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Input,
  useToast,
} from '@chakra-ui/react'
import * as Humanize from 'humanize-plus'
import { RiQuestionLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useNetwork, useAccount } from 'wagmi'
import config from '@/config'

const LockFormCommon = ({
  hasNewLockDate,
  lockAmount,
  handleLockOrIncreaseAmount,
  handleLockPeriodUpdate,
  isLoading,
  hasSlider,
}: {
  hasNewLockDate?: boolean
  lockAmount?: number
  handleLockOrIncreaseAmount?: (calculatedLockPeriod?: number) => void
  handleLockPeriodUpdate?: (newUnlockDate: Date) => void
  isLoading: boolean
  hasSlider: boolean
}) => {
  const [lockPeriod, setLockPeriod] = useState(0)
  const { lockEndDate, getMaximumLockablePeriod } = useLockOverview()
  const [lockend, setLockend] = useState<Date>()
  const [lockValue, setLockValue] = useState(0)
  const [remainingLockablePeriod, setRemainingLockablePeriod] = useState(208)
  const toast = useToast()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()

  const updateLockend = (lockPeriodInput: number) => {
    const temp = lockend || new Date()
    if (lockPeriodInput === 0) {
      setLockValue(0)
      temp.setDate(temp.getUTCDate() - 7)
      setLockend(temp)
      return
    }

    if (!lockValue) temp.setDate(temp.getUTCDate() + lockPeriodInput)
    else {
      if (lockPeriodInput < lockValue)
        temp.setDate(temp.getUTCDate() - (lockValue - lockPeriod))

      if (lockPeriodInput > lockValue)
        temp.setDate(temp.getUTCDate() + (lockPeriodInput - lockValue))
    }

    setLockend(temp)
    setLockValue(lockPeriodInput)
  }

  useEffect(() => {
    if (hasNewLockDate && lockEndDate && typeof lockEndDate !== 'number') {
      const fetchMaxLockPeriod = async () => {
        const maxDate = await getMaximumLockablePeriod(lockEndDate)
        if (maxDate > 0) {
          const weeks = Number(maxDate / 7)
          if (weeks > 0) setRemainingLockablePeriod(Number(weeks.toFixed()))
        } else setRemainingLockablePeriod(208)
      }
      fetchMaxLockPeriod()
    }
    if (!lockend && lockEndDate && typeof lockEndDate !== 'number') {
      setLockend(lockEndDate)
    }
  }, [lockEndDate])

  const updateLockPeriod = (value: number | string) => {
    if (value) {
      const convertedValue = typeof value === 'string' ? parseInt(value) : value
      if (convertedValue <= remainingLockablePeriod) {
        setLockPeriod(convertedValue)
        updateLockend(convertedValue * 7)
      } else {
        toast({
          title: `The lock period cannot be greater than the maximum locable period which is ${remainingLockablePeriod} weeks`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
      }
    }
  }

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
      handleLockOrIncreaseAmount(lockValue)
    }

    if (handleLockPeriodUpdate) {
      if (lockValue < 1 || !lockend || lockend <= lockEndDate) {
        toast({
          title: `You need to specify a new lock period and it must be more than the current unlock date`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
        return
      }
      handleLockPeriodUpdate(lockend)
    }
  }

  return (
    <>
      {hasSlider && (
        <Flex direction="column" w="full" gap="3">
          <Flex
            p="5"
            pr="5"
            rounded="lg"
            border="solid 1px"
            borderColor="divider"
          >
            <Flex direction="column" gap="2">
              <Text color="grayText2" fontSize="xs">
                Lock period (weeks)
              </Text>
              <RangeSlider
                colorScheme="pink"
                w={{ base: 170, md: 330, lg: 250 }}
                defaultValue={[lockPeriod]}
                value={[lockPeriod]}
                onChange={value => updateLockPeriod(value[0])}
                step={4}
                max={remainingLockablePeriod}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
              </RangeSlider>
            </Flex>
            <Flex ml="auto" align="end">
              <InputGroup bg="transparent" size="xs">
                <InputLeftAddon
                  cursor="pointer"
                  onClick={() => updateLockPeriod(lockPeriod - 1)}
                >
                  <Text>-</Text>
                </InputLeftAddon>
                <Input
                  value={lockPeriod}
                  w="10"
                  onChange={e => updateLockPeriod(e.target.value)}
                />
                <InputRightAddon
                  cursor="pointer"
                  onClick={() => updateLockPeriod(lockPeriod + 1)}
                >
                  <Text>+</Text>
                </InputRightAddon>
              </InputGroup>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Flex w="full" direction="column" gap="4" fontSize="xs">
        {hasNewLockDate && typeof lockEndDate !== 'number' && (
          <Flex rounded="md" align="center" bg="divider" p={2}>
            <Text>New lock date </Text>
            <Text fontWeight="semibold" color="brandText" ml="auto">
              {lockEndDate.toDateString()}
            </Text>
          </Flex>
        )}
        {lockAmount ? (
          <Flex rounded="md" align="center" bg="divider" p={2}>
            <Text>New HiIQ balance </Text>
            <Text fontWeight="semibold" color="brandText" ml="auto">
              {Humanize.formatNumber(
                lockAmount + (lockAmount * 3 * lockValue) / 1460,
                2,
              )}
              HiIQ
            </Text>
          </Flex>
        ) : null}
        {lockend && (
          <Flex align="center" w="full">
            <Icon color="brandText" as={RiQuestionLine} mr={1} />
            <Text color="brandText" fontSize={{ base: 'xx-small', md: 'xs' }}>
              Your lock end date will be {`${lockend.toDateString()}`}
            </Text>
          </Flex>
        )}
      </Flex>
      <Button isLoading={isLoading} w="full" onClick={() => handleLockButton()}>
        Lock
      </Button>
    </>
  )
}

export default LockFormCommon
