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
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine } from 'react-icons/ri'
import { useConnect, Connector } from 'wagmi'
import { WALLET_LOGOS } from '@/data/WalletData'
import { usePostHog } from 'posthog-js/react'

const WalletConnect = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const posthog = usePostHog()
  const { connectors, connect } = useConnect({
    onError(error) {
      posthog.capture('LOGIN_ERROR', {
        action: 'LOGIN_ERROR',
        errorReason: error.message,
        category: 'connectors',
      })
    },
    onSuccess(data) {
      posthog.capture('LOGIN_SUCCESS', {
        action: 'LOGIN_SUCCESS',
        userAddress: data.account,
        category: 'connectors',
      })
      onClose()
    },
  })

  const handleConnect = (selectedConnector: Connector) => {
    posthog.capture('LOGIN_ATTEMPT', {
      action: 'LOGIN_ATTEMPT',
      label: selectedConnector.name,
      category: 'connectors',
    })

    connect({ connector: selectedConnector })
    onClose()
  }
  const cancelRef = React.useRef<FocusableElement>(null)

  if (!isOpen) return null
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size={{ base: 'md', md: 'lg' }}
    >
      <AlertDialogOverlay />
      <AlertDialogContent mx={{ base: '15px', md: '0' }}>
        <Box p={8}>
          <Flex>
            <Box flex="1">
              <Text fontWeight="black">
                Connect your wallet to the IQ Dashboard
              </Text>
              <Text fontSize="sm" mt="1" w="95%" fontWeight="medium">
                To proceed to the IQ Dashboard, Approve connection in your
                wallet to authorize access
              </Text>
            </Box>
            <Icon
              cursor="pointer"
              fontSize="3xl"
              fontWeight={600}
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>

          <Box mt="6">
            {connectors.map((connector, index) => (
              <Flex
                py={3}
                my={3}
                px={3}
                rounded="lg"
                border="solid 1px "
                borderColor="divider"
                key={index}
                onClick={() => handleConnect(connector)}
                cursor="pointer"
              >
                <Icon mr={3} as={WALLET_LOGOS[index]} fontSize="3xl" />
                <Spacer />
                <Text fontWeight="medium">{connector.name}</Text>
              </Flex>
            ))}
          </Box>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default WalletConnect
