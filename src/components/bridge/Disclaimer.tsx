import { InfoIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertTitle,
  Box,
  CloseButton,
  Spacer,
  Text,
  useDisclosure,
  chakra,
} from '@chakra-ui/react'
import React from 'react'
import Link from '../elements/LinkElements/Link'

const Disclaimer = () => {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true })
  return isVisible ? (
    <Box my={1}>
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
            at $20. This decision has been implemented due to an{' '}
            <chakra.span
              fontWeight="bold"
              textDecoration="underline"
              cursor="pointer"
            >
              <Link href="https://dao.pnetworkprotocol.eth.limo/#/" isExternal>
                increase in the protocol fee
              </Link>
            </chakra.span>{' '}
            (Gas fee) associated with each transaction.
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
