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
  Box,
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'
import { useTranslations } from 'next-intl'

const LockSlider = ({
  updateLockend,
}: {
  updateLockend: (value: number, exitingLockEnd?: Date) => void
}) => {
  const { showToast } = useReusableToast()
  const { isConnected } = useAccount()
  const { getMaximumLockablePeriod } = useLockOverview()
  const [remainingLockablePeriod, setRemainingLockablePeriod] = useState(208)
  const { lockEndDate } = useLockEnd()
  const [isMaxLockPeriodReached, setIsMaxLockPeriodReached] = useState(false)

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
  const DAYS_PER_WEEK = 7
  const MILLISECONDS_PER_WEEK = MILLISECONDS_PER_DAY * DAYS_PER_WEEK

  const [lockPeriod, setLockPeriod] = useState(
    lockEndDate ? Math.ceil(lockEndDate.getTime() / MILLISECONDS_PER_WEEK) : 1,
  )

  const t = useTranslations('hiiq.stake.stakeIQ')

  useEffect(() => {
    const checkMaxLockPeriod = async () => {
      if (lockEndDate) {
        const maxDate = await getMaximumLockablePeriod(lockEndDate)
        if (maxDate > 0) {
          const weeks = Number(maxDate / DAYS_PER_WEEK)

          if (weeks > 1) {
            setRemainingLockablePeriod(Number(weeks.toFixed()))
            if (lockEndDate.getTime() >= maxDate) {
              setIsMaxLockPeriodReached(true)
              setLockPeriod(Number(weeks.toFixed()))
              updateLockend(weeks * DAYS_PER_WEEK, lockEndDate)
            }
          } else {
            setRemainingLockablePeriod(0)
            setLockPeriod(0)
          }
        } else setRemainingLockablePeriod(208)
      }
    }
    checkMaxLockPeriod()
  }, [lockEndDate, getMaximumLockablePeriod])

  useEffect(() => {
    const defaultLockPeriod = remainingLockablePeriod > 0 ? DAYS_PER_WEEK : 0

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
        updateLockend(convertedValue * DAYS_PER_WEEK, lockEndDate)
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
      {isMaxLockPeriodReached && (
        <Flex
          direction="column"
          w="full"
          gap="3"
          p="5"
          rounded="lg"
          border="solid 1px"
          borderColor="green.500"
          bg="green.50"
        >
          <Box>
            <Text color="green.700" fontWeight="bold">
              Maximum Lock Period Reached
            </Text>
            <Text color="green.600" fontSize="sm">
              Your stake is locked for the maximum allowed period.
            </Text>
          </Box>
        </Flex>
      )}
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
            {t('lockPeriods')}
          </Text>
          <RangeSlider
            colorScheme="pink"
            w={{ base: 'full', md: 330, lg: 250 }}
            defaultValue={[lockPeriod]}
            value={[lockPeriod]}
            onChange={value => updateLockPeriod(value[0])}
            step={1}
            max={remainingLockablePeriod}
            isDisabled={isMaxLockPeriodReached}
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
              onChange={e => updateLockPeriod(e.target.value)}
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
