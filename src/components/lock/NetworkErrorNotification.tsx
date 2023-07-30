import React, { useRef } from 'react'
import {
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Flex,
  Text,
  Icon,
  Button,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine, RiErrorWarningFill } from 'react-icons/ri'
import { NetworkErrorNotificationType } from '@/types/lockTypes'

const NetworkErrorNotification = ({
  onClose,
  isOpen,
  switchNetwork,
}: NetworkErrorNotificationType) => {
  const cancelRef = useRef<FocusableElement>(null)
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
              fontSize="3xl"
              fontWeight={600}
              as={RiErrorWarningFill}
              mr={5}
            />
            <Text flex="1" fontSize="xl" fontWeight="black">
              Switch Network
            </Text>
            <Icon
              cursor="pointer"
              fontSize="3xl"
              fontWeight={600}
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>
          <Text mt="6" w="90%" lineHeight="2" fontWeight="medium">
            Your wallet is currently connected to an unsupported network. To
            continue with Ethereum network, Switch the network in your wallet to
            Ethereum.
          </Text>
          <Text mt="6" w="90%" lineHeight="2" fontWeight="medium">
            Switch wallet if unable to change wallet network.
          </Text>
          <Flex mt="6">
            <Text
              onClick={onClose}
              color="primary"
              cursor="pointer"
              pt={2}
              flex="1"
              fontSize="sm"
              fontWeight="bold"
            >
              Dismiss
            </Text>
            <Button onClick={() => switchNetwork()} variant="outline">
              Switch Network
            </Button>
          </Flex>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NetworkErrorNotification
