import { InfoIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertTitle,
  Box,
  CloseButton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'

const Disclaimer = () => {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true })
  return isVisible ? (
    <Box mb={3} mt={2}>
      <Alert
        bg="disclaimerBg"
        border="1px solid"
        borderColor="disclaimerBorder"
        borderRadius="md"
        color="brandLinkColor"
      >
        <InfoIcon
          mr={4}
          alignSelf="flex-start"
          position="relative"
          right={-1}
          mt={1}
        />
        <Box>
          <AlertTitle>Disclaimer</AlertTitle>
          <Text width="97%" my={2}>
            Please note that the minimum limit for a bridge transfer is now set
            at $20. This decision has been implemented due to an increase in the
            protocol fee (Gas fee) associated with each transaction.
          </Text>
        </Box>
        <Spacer />
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={onClose}
        />
      </Alert>
    </Box>
  ) : null
}

export default Disclaimer
