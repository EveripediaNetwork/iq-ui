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
  useToast,
  HStack,
  chakra,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { MAX_USER_WEIGHT } from '@/data/GaugesConstants'
import { Gauge } from '@/types/gauge'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

const VotingControls = () => {
  const toast = useToast()
  const [weightToAllocate, setWeightToAllocate] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const { userVotingPower, canVote, vote, refetchLastUserVoteData } =
    useGaugeCtrl()
  const { unusedRaw } = getUnusedWeight(userVotingPower)
  const currentGauge: Gauge | undefined = useSelector(
    (state: RootState) => state.gauges.currentGauge,
  )
  const handleVote = async () => {
    if (currentGauge) {
      setIsVoting(true)
      const { isError, msg } = await vote(
        currentGauge?.gaugeAddress,
        (weightToAllocate * MAX_USER_WEIGHT) / 100,
      )
      toast({
        title: msg,
        position: 'top-right',
        isClosable: true,
        status: isError ? 'error' : 'success',
      })
      refetchLastUserVoteData()
      setIsVoting(false)
    } else {
      toast({
        title: 'You need to select the gauge you want to vote for',
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
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
        <HStack mt={2}>
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
