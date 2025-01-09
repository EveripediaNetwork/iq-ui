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
import { useTranslations } from 'next-intl'

const ClaimModal = ({
  isOpen,
  onClose,
  onYes,
  isLoading,
  isDisabled,
}: {
  isOpen: boolean
  onClose: () => void
  onYes: () => void
  isLoading: boolean
  isDisabled: boolean
}) => {
  const t = useTranslations('hiiq.claimWarning')
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
          {t('title')}
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text textAlign="center">{t('message')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter justifyContent="center">
          <Button
            isDisabled={isDisabled}
            onClick={onYes}
            isLoading={isLoading}
            mr={3}
          >
            {t('claim')}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('dismiss')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default ClaimModal
