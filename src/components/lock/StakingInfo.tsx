import React from 'react'
import {
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Flex,
  Text,
  Icon,
  Spacer,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine, RiQuestionLine } from 'react-icons/ri'
import { BraindaoLogo } from '../braindao-logo'

const StakingInfo = ({
  onClose,
  isOpen,
  isBrainyStaking,
}: {
  isOpen: boolean
  onClose: () => void
  isBrainyStaking?: boolean
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
      size="xl"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <Box p={8}>
          <Flex>
            <Icon
              cursor="pointer"
              fontSize="2xl"
              fontWeight={600}
              as={RiQuestionLine}
              mr={2}
              color="brandText"
            />
            <Spacer />
            <Icon
              cursor="pointer"
              fontSize="3xl"
              fontWeight={600}
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>

          <Box
            mt="5"
            textAlign="center"
            border="1px solid"
            borderColor="divider"
            py={10}
            px={4}
            rounded="lg"
          >
            {isBrainyStaking ? (
              <>
                <Text fontSize="sm" lineHeight="24px" fontWeight="medium">
                  The longer you lock your Gauges, the more HiIQ you will
                  receive. HiIQ decays slowly over your locking period,
                  eventually reaching 1 -to- 1 with IQ.
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="sm" lineHeight="24px" fontWeight="medium">
                  The longer you lock your IQ, the more HiIQ you will receive.
                  HiIQ decays slowly over your locking period, eventually
                  reaching 1 -to- 1 with IQ.
                </Text>
                <VStack mt="10" rowGap={3}>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={BraindaoLogo} />
                    <Text fontWeight="medium">
                      1 IQ locked for 4 years ~ 3.99 HiIQ
                    </Text>
                  </HStack>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={BraindaoLogo} />
                    <Text fontWeight="medium">
                      1 IQ locked for 3 years ~ 3.24 HiIQ
                    </Text>
                  </HStack>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={BraindaoLogo} />
                    <Text fontWeight="medium">
                      1 IQ locked for 2 years ~ 2.50 HiIQ
                    </Text>
                  </HStack>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={BraindaoLogo} />
                    <Text fontWeight="medium">
                      1 IQ locked for 1 years ~ 1.75 HiIQ
                    </Text>
                  </HStack>
                </VStack>
              </>
            )}
          </Box>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StakingInfo
