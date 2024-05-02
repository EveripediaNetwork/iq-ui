import React, { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiErrorWarningFill } from 'react-icons/ri'

const CheckpointModal = ({
  isOpen,
  onClose,
  onYes,
}: { isOpen: boolean; onClose: () => void; onYes: () => void }) => {
  const cancelRef = useRef<FocusableElement>(null)

  if (!isOpen) return null

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      motionPreset="slideInBottom"
      isCentered
      size="lg"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader
          fontSize="xl"
          fontWeight="bold"
          display="flex"
          alignItems="center"
        >
          <RiErrorWarningFill style={{ marginRight: '10px' }} />
          Unclaimed Rewards
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text textAlign="center">
            You have unclaimed rewards available. Please checkpoint before
            claiming to maximize your earnings.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onYes} mr={3}>
            Checkpoint
          </Button>
          <Button variant="outline" onClick={onClose}>
            Dismiss
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CheckpointModal
