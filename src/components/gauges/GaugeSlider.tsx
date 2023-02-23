import React, { useState, useEffect } from 'react'
import {
  Flex,
  Text,
  Input,
  InputLeftAddon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  InputGroup,
  SliderThumb,
  InputRightAddon,
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { calculateMaxStakePeriod } from '@/utils/gauges.util'

const GaugeSlider = ({
  updateLockPeriod,
}: {
  updateLockPeriod: (days: number) => void
}) => {
  const [lockPeriod, setLockPeriod] = useState(7)
  const { isConnected } = useAccount()
  const [remainingLockablePeriod, setRemainingLockablePeriod] = useState(365)
  const { lockedStakes } = useNFTGauge()
  useEffect(() => {
    if (lockedStakes.length > 0) {
      const fetchMaxLockPeriod = async () => {
        const stakeDaysRemaining = calculateMaxStakePeriod(
          lockedStakes[0].startTimestamp,
          lockedStakes[0].endingTimestamp,
        )
        if (stakeDaysRemaining > 0) {
          const maxDays = 365 - stakeDaysRemaining
          if (maxDays > 0) setRemainingLockablePeriod(maxDays)
        } else setRemainingLockablePeriod(365)
      }
      fetchMaxLockPeriod()
    } else {
      setRemainingLockablePeriod(365)
    }
  }, [lockedStakes])

  const handleIncrementDecrement = (value: number) => {
    if (value < 7 || value > 365) return
    setLockPeriod(value)
    updateLockPeriod(value)
  }
  return (
    <Flex
      p={5}
      mb={3}
      borderRadius="6px"
      border="solid 1px "
      borderColor="divider"
      direction="column"
      justifyContent="space-around"
      w={[250, 370]}
    >
      <Text fontSize="xs">Stake period (days)</Text>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        w="100%"
      >
        <Slider
          aria-label="slider-ex-2"
          colorScheme="pink"
          defaultValue={0}
          min={7}
          ml={2}
          max={remainingLockablePeriod}
          value={lockPeriod}
          onChange={val => handleIncrementDecrement(val)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Flex mt={{ base: '3', md: '0' }} ml={4} align="end">
          <InputGroup bg="lightCard" size="xs">
            <InputLeftAddon
              cursor="pointer"
              onClick={() => handleIncrementDecrement(lockPeriod - 1)}
              bg="lightCard"
              color="grayText4"
            >
              <Text>-</Text>
            </InputLeftAddon>
            <Input
              max={365}
              value={lockPeriod}
              w={{ base: 'full', md: '10' }}
              onChange={e => handleIncrementDecrement(Number(e.target.value))}
              color="grayText4"
              disabled={!isConnected}
              bg="lightCard"
              textAlign="center"
            />
            <InputRightAddon
              cursor="pointer"
              color="grayText4"
              onClick={() => handleIncrementDecrement(lockPeriod + 1)}
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

export default GaugeSlider
