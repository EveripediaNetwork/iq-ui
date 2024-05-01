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
import { logEvent } from '@/utils/googleAnalytics'

const WalletConnect = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { connectors, connect, isError, isSuccess, error, data } = useConnect()

  const handleLogs = () => {
    if (isError && error) {
      logEvent({
        action: 'LOGIN_ERROR',
        label: error.message,
        value: 0,
        category: 'login_status',
      })
    }

    if (isSuccess && data) {
      logEvent({
        action: 'LOGIN_SUCCESS',
        label: JSON.stringify(data.accounts[0]),
        value: 1,
        category: 'login_status',
      })
      const w = window as any
      w.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        user_id: data.accounts[0],
      })
      onClose()
    }
  }

  const handleConnect = (selectedConnector: Connector) => {
    logEvent({
      action: 'LOGIN_ATTEMPT',
      label: selectedConnector.name,
      value: 1,
      category: 'connectors',
    })
    connect({ connector: selectedConnector })
    handleLogs()
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
