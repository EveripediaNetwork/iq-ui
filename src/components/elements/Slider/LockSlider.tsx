import React, { useState, useEffect } from 'react'
import {
  Flex,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Input,
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'

const LockSlider = ({
  updateLockend,
}: {
  updateLockend: (value: number, exitingLockEnd?: Date) => void
}) => {
  const { showToast } = useReusableToast()
  const { isConnected } = useAccount()
  const { getMaximumLockablePeriod } = useLockOverview()
  const [remainingLockablePeriod, setRemainingLockablePeriod] = useState(208)
  const [lockPeriod, setLockPeriod] = useState(1)
  const { lockEndDate } = useLockEnd()

  useEffect(() => {
    if (lockEndDate && typeof lockEndDate !== 'number') {
      const fetchMaxLockPeriod = async () => {
        const maxDate = await getMaximumLockablePeriod(lockEndDate)
        if (maxDate > 0) {
          const weeks = Number(maxDate / 7)
          if (weeks > 1) setRemainingLockablePeriod(Number(weeks.toFixed()))
          else {
            setRemainingLockablePeriod(0)
            setLockPeriod(0)
          }
        } else setRemainingLockablePeriod(208)
      }
      fetchMaxLockPeriod()
    } else {
      setRemainingLockablePeriod(208)
    }
  }, [lockEndDate, getMaximumLockablePeriod])

  useEffect(() => {
    const defaultLockPeriod = remainingLockablePeriod > 0 ? 7 : 0

    if (lockEndDate) {
      updateLockend(defaultLockPeriod)
      setLockPeriod(1)
    } else {
      updateLockend(defaultLockPeriod)
    }
  }, [lockEndDate, remainingLockablePeriod])

  const updateLockPeriod = (value: number | string) => {
    if (!isConnected) return
    if (value) {
      const convertedValue = typeof value === 'string' ? parseInt(value) : value
      if (convertedValue <= remainingLockablePeriod) {
        setLockPeriod(convertedValue)
        updateLockend(convertedValue * 7, lockEndDate)
      } else {
        let msg = ''
        if (remainingLockablePeriod > 0)
          msg = `The lock period cannot be greater than the maximum lockable period for you, which is ${remainingLockablePeriod} weeks`
        else msg = 'You have reached the maximum lockable period'
        showToast(msg, 'error')
      }
    }
  }

  return (
    <Flex direction="column" w="full" gap="3">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        p="5"
        pr="5"
        rounded="lg"
        border="solid 1px"
        borderColor="divider"
      >
        <Flex direction="column" gap="2">
          <Text color="fadedText4" fontSize="xs" fontWeight="medium">
            Lock period (weeks)
          </Text>
          <RangeSlider
            colorScheme="pink"
            w={{ base: 'full', md: 330, lg: 250 }}
            defaultValue={[lockPeriod]}
            value={[lockPeriod]}
            onChange={(value) => updateLockPeriod(value[0])}
            step={1}
            max={remainingLockablePeriod}
          >
            <RangeSliderTrack bg="divider2">
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
          </RangeSlider>
        </Flex>
        <Flex mt={{ base: '3', md: '0' }} ml={{ md: 'auto' }} align="end">
          <InputGroup bg="lightCard" size="xs">
            <InputLeftAddon
              cursor="pointer"
              onClick={() => updateLockPeriod(lockPeriod - 1)}
              bg="lightCard"
              color="grayText4"
            >
              <Text>-</Text>
            </InputLeftAddon>
            <Input
              value={lockPeriod}
              w={{ base: 'full', md: '10' }}
              onChange={(e) => updateLockPeriod(e.target.value)}
              color="grayText4"
              disabled={!isConnected}
              bg="lightCard"
              textAlign="center"
            />
            <InputRightAddon
              cursor="pointer"
              color="grayText4"
              onClick={() => updateLockPeriod(lockPeriod + 1)}
              bg="lightCard"
            >
              <Text>+</Text>
            </InputRightAddon>
          </InputGroup>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LockSlider
