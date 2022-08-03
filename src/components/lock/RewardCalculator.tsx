import React from 'react'
import {
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Flex,
  Text,
  Icon,
  Stack,
  VStack,
  InputGroup,
  InputRightElement,
  Input,
  HStack,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine } from 'react-icons/ri'
import { BraindaoLogo } from '../braindao-logo'

const RewardCalculator = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const cancelRef = React.useRef<FocusableElement>(null)
  if (!isOpen) return null
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
              <Text fontWeight="black">Reward Calculator</Text>
            </Box>
            <Icon
              cursor="pointer"
              fontSize="2xl"
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>
          <VStack mt="5" align="center">
            <Text color="grayText2" fontSize="md">
              Supply
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              1,444,396,475 HiIQ
            </Text>
          </VStack>
          <Box mt="6">
            <Text textAlign="left" mb={1}>
              Amount of IQ to lock
            </Text>
            <InputGroup>
              <Input placeholder="0" />
              <InputRightElement>
                <HStack mr={10}>
                  <Icon as={BraindaoLogo} boxSize={6} color="green.500" />
                  <Text fontWeight="bold">IQ</Text>
                </HStack>
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box mt="10">
            <Text textAlign="left" mb={1}>
              No of years to lock the IQ
            </Text>
            <InputGroup>
              <Input placeholder="0" />
              <InputRightElement>
                <HStack mr={6}>
                  <Text>Years</Text>
                </HStack>
              </InputRightElement>
            </InputGroup>
          </Box>
          <VStack rowGap={2} my={8}>
            <Stack direction="row" spacing="56">
              <Text>Total Reward </Text>
              <Text fontWeight="bold">IQ</Text>
            </Stack>
            <Stack direction="row" spacing={32}>
              <Text>Yield across lock period:</Text>
              <Text fontWeight="bold">0%</Text>
            </Stack>
          </VStack>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RewardCalculator
