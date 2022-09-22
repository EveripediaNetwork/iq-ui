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
  Button,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine, RiErrorWarningFill } from 'react-icons/ri'

const UnlockNotification = ({
  onClose,
  isOpen,
  handleUnlock,
}: {
  isOpen: boolean
  onClose: () => void
  handleUnlock: () => void
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
      size="lg"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <Box p={8}>
          <Flex>
            <Icon
              cursor="pointer"
              fontSize="2xl"
              fontWeight={600}
              as={RiErrorWarningFill}
              mr={2}
            />
            <Box flex="1">
              <Text fontWeight="black">Unlock IQ</Text>
            </Box>
            <Icon
              cursor="pointer"
              fontSize="3xl"
              fontWeight={600}
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>

          <Box mt="10">
            <Text textAlign="center" fontWeight="medium">
              You are about to unlock your staked IQ. Do you wish to continue?
            </Text>
          </Box>
          <Stack
            display="flex"
            justify="center"
            align="center"
            my="10"
            direction="row"
            spacing={3}
          >
            <Button
              onClick={() => handleUnlock()}
              fontSize={{ base: 'xs', md: 'sm' }}
              variant="solid"
            >
              Unlock
            </Button>
            <Button
              borderColor="divider2"
              variant="outline"
              fontSize={{ base: 'xs', md: 'sm' }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default UnlockNotification
