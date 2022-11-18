import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import React, { useState } from 'react'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import {
  Box,
  Flex,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react'
import { getUnusedWeight } from '@/utils/gauges.util'
import config from '@/config'

const VotingControls = () => {
  const currentGauge: Gauge = useAppSelector(state => state.gauges.currentGauge)
  const [weightToAllocate, setWeightToAllocate] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const { userVotingPower, canVote, vote } = useGaugeCtrl()
  const { unusedRaw } = getUnusedWeight(userVotingPower)

  const handleVote = () => {
    setIsVoting(true)
    vote(config.nftFarmAddress, weightToAllocate)
    setIsVoting(false)
  }

  console.log(weightToAllocate)

  return (
    <Flex direction="column">
      <Flex direction="row" justifyContent="space-between">
        <Slider
          isDisabled={unusedRaw === 0 || !canVote}
          aria-label="slider-ex-2"
          colorScheme="pink"
          defaultValue={0}
          value={weightToAllocate}
          onChange={setWeightToAllocate}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <NumberInput
          isDisabled={unusedRaw === 0 || !canVote}
          defaultValue={0}
          ml={3}
          maxW={20}
          min={0}
          max={100}
          value={weightToAllocate}
          onChange={(_, value: number) => setWeightToAllocate(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button onClick={handleVote} disabled={!canVote || weightToAllocate === 0} ml={4}>
          Vote
        </Button>
      </Flex>
      {currentGauge !== undefined ? (
        <Box maxW="sm">
          <Flex flexDirection="row" width={360} justifyContent="space-between">
            <Text fontWeight="bold">Gauge: </Text>
            <Text>{currentGauge.name}</Text>
          </Flex>
          <Flex flexDirection="row" width={360} justifyContent="space-between">
            <Text fontWeight="bold">
              % of the remaining weight to allocate:
            </Text>
            <Text>{weightToAllocate}</Text>
          </Flex>
          {/* <Flex
            flexDirection="row"
            width={360}
            justifyContent="space-between"
          >
            <Text fontWeight="bold">Remaining after the vote:</Text>
            <Text>{userVotingPower - weightToAllocate}</Text>
          </Flex> */}
        </Box>
      ) : null}
    </Flex>
  )
}

export default VotingControls
