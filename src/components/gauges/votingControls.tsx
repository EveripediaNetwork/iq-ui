import React, { useState } from 'react'
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
  HStack,
  chakra,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { MAX_USER_WEIGHT } from '@/data/GaugesConstants'
import { Gauge } from '@/types/gauge'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store/hook'
import { setVotes } from '@/store/slices/gauges-slice'
import { ShowToast } from './brainiesStakes'

const VotingControls = () => {
  const [weightToAllocate, setWeightToAllocate] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const { userVotingPower, canVote, vote, refetchLastUserVoteData, events } =
    useGaugeCtrl()
  const { unusedRaw } = getUnusedWeight(userVotingPower)
  const currentGauge: Gauge | undefined = useSelector(
    (state: RootState) => state.gauges.currentGauge,
  )
  const dispatch = useAppDispatch()

  const handleVote = async () => {
    if (currentGauge) {
      setIsVoting(true)
      const { isError, msg } = await vote(
        currentGauge?.gaugeAddress,
        (weightToAllocate * MAX_USER_WEIGHT) / 100,
      )
      ShowToast(msg, isError ? 'error' : 'success')
      refetchLastUserVoteData()
      const newVotes = await events()
      if (newVotes) {
        dispatch(setVotes(newVotes))
      }
      setIsVoting(false)
    } else {
      ShowToast('You need to select the gauge you want to vote for', 'error')
    }
  }

  return (
    <Flex direction="column">
      <Flex direction="column">
        <Box>
          <Flex
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="space-between"
            mb={1}
          >
            <Text fontWeight="bold" fontSize="sm">
              Gauges:{' '}
              <chakra.span fontSize="xs" fontWeight="normal">
                {' '}
                % of weight to allocate:
              </chakra.span>
            </Text>
          </Flex>
        </Box>
        <HStack>
          <Slider
            aria-label="slider-ex-2"
            colorScheme="pink"
            defaultValue={0}
            value={weightToAllocate}
            onChange={v => setWeightToAllocate(v)}
            id="slider"
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <NumberInput
            isDisabled={unusedRaw === 0 || !canVote}
            defaultValue={0}
            maxW={20}
            min={0}
            max={100}
            value={weightToAllocate}
            onChange={(_, value: number) =>
              setWeightToAllocate(Number.isNaN(value) ? 0 : value)
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button
            onClick={handleVote}
            disabled={isVoting || !canVote || weightToAllocate === 0}
            ml={4}
          >
            {isVoting ? 'Loading' : 'Vote'}
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}

export default VotingControls
