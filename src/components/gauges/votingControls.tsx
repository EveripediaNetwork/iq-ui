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
import config from '@/config'
import { MAX_USER_WEIGHT } from '@/data/GaugesConstants'

const VotingControls = () => {
  const toast = useToast()
  // const currentGauge: Gauge | undefined = useAppSelector(
  //   state => state.gauges.currentGauge,
  // )
  const [weightToAllocate, setWeightToAllocate] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const { userVotingPower, canVote, vote } = useGaugeCtrl()
  const { unusedRaw } = getUnusedWeight(userVotingPower)

  const handleVote = async () => {
    setIsVoting(true)
    const { isError, msg } = await vote(
      config.nftFarmAddress,
      (weightToAllocate * MAX_USER_WEIGHT) / 100,
    )
    toast({
      title: msg,
      position: 'top-right',
      isClosable: true,
      status: isError ? 'error' : 'success',
    })

    setIsVoting(false)
  }

  return (
    <Flex direction="column">
      <Box
        border="solid 1px"
        borderColor="divider"
        rounded="lg"
        pt="4"
        px="2"
        mb={6}
      >
        <Text ml="2">Voting Details</Text>
        <Text fontSize="sm" textAlign="center" my={15} fontWeight="thin">
          Some details, info and guide on how to vote and use the voting
          allocation tab.
        </Text>
      </Box>
       <Flex direction="column" px={2}>
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
            <Text textAlign="left">{weightToAllocate}</Text>
          </Flex>
        </Box>
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
        <HStack mt={6}>
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
