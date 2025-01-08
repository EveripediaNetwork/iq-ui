import React, { useEffect, useState } from 'react'
import {
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Flex,
  Text,
  Icon,
  VStack,
  InputGroup,
  InputRightElement,
  Input,
  HStack,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import * as Humanize from 'humanize-plus'
import { calculateStakeReward } from '@/utils/LockOverviewUtils'
import { IQLogo } from '../iq-logo'

const CalculatorResult = ({
  result,
  title,
  symbol,
}: {
  result: number
  title: string
  symbol: string
}) => {
  return (
    <Flex align="center" px="13px" gap="2.5" w="full">
      <Text fontWeight="medium">{title}</Text>
      <Flex
        ml="auto"
        direction="column"
        align="space-between"
        textAlign="right"
      >
        <Text fontWeight="bold" fontSize="sm" color="fadedText5">
          {Humanize.formatNumber(result, 2)} {symbol}
        </Text>
      </Flex>
    </Flex>
  )
}

const RewardCalculator = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const cancelRef = React.useRef<FocusableElement>(null)
  const { totalHiiqSupply } = useLockOverview()
  const [expectedReturn, setExpectedReward] = useState(0)
  const [inputIQ, setInputIQ] = useState(0)
  const [years, setYears] = useState(4)

  useEffect(() => {
    if (years && inputIQ) {
      // TODO: review calculation APR needs to be calculated w generated HiIQ not w inputIQ
      const userReward = calculateStakeReward(totalHiiqSupply, inputIQ, years)
      setExpectedReward(userReward)
    } else {
      setExpectedReward(0)
    }
  }, [years, inputIQ, totalHiiqSupply])

  if (!isOpen) return null

  const updateYrs = (lockedYrs: number) => {
    if (lockedYrs > 4 || lockedYrs < 0) return
    setYears(lockedYrs)
  }
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="md"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <Box p={8}>
          <Flex>
            <Box flex="1">
              <Text fontWeight="bold">Reward Calculator</Text>
            </Box>
            <Icon
              cursor="pointer"
              fontSize="2xl"
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>
          <VStack mt="5" align="center">
            <Text fontWeight="medium" color="grayText2" fontSize="md">
              Supply
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {Humanize.formatNumber(totalHiiqSupply, 2)} HiIQ
            </Text>
          </VStack>
          <Box mt="6">
            <Text fontWeight="bold" textAlign="left" mb={1}>
              Amount of IQ to lock
            </Text>
            <InputGroup>
              <Input
                value={inputIQ}
                onChange={(e) => setInputIQ(e.target.valueAsNumber)}
                type="number"
                placeholder="0"
              />
              <InputRightElement>
                <HStack mr={10}>
                  <Icon as={IQLogo} boxSize={6} color="green.500" />
                  <Text fontWeight="bold">IQ</Text>
                </HStack>
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box mt="10">
            <Text fontWeight="bold" textAlign="left" mb={1}>
              No of years to lock the IQ (4 years max)
            </Text>
            <InputGroup>
              <Input
                value={years}
                placeholder="4"
                onChange={(e) => updateYrs(e.target.valueAsNumber)}
                type="number"
              />
              <InputRightElement>
                <HStack mr={6}>
                  <Text fontWeight="bold">Years</Text>
                </HStack>
              </InputRightElement>
            </InputGroup>
          </Box>
          <VStack rowGap={2} my={8}>
            <CalculatorResult
              title="Total Reward"
              result={expectedReturn}
              symbol="IQ"
            />
          </VStack>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RewardCalculator
