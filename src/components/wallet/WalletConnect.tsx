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
import { useConnect } from 'wagmi'
import { WALLET_LOGOS } from '@/data/WalletData'

const WalletConnect = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { connectors, connect } = useConnect({
    onConnect(){
      onClose()
    }
  })
  const cancelRef = React.useRef<FocusableElement>(null)
  const handleConnect = (provider: any) => {
    connect(provider)
  }
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
            <Box flex="1">
              <Text fontWeight="black">
                Connect your wallet to the IQ Dashboard
              </Text>
              <Text fontSize="sm" mt="1" w="95%" fontWeight="light">
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
            {connectors.map((c, index) => (
              <Flex
                py={3}
                my={3}
                px={3}
                rounded="lg"
                border="solid 1px "
                borderColor="divider"
                key={index}
                onClick={() => handleConnect(c)}
                cursor="pointer"
              >
                <Icon mr={3} as={WALLET_LOGOS[index]} fontSize="3xl" />
                <Spacer />
                <Text>{c.name}</Text>
              </Flex>
            ))}
          </Box>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default WalletConnect
