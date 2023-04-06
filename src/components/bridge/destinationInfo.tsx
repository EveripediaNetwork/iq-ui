import React, { LegacyRef } from 'react'
import { AuthContextType, Token, TokenId } from '@/types/bridge'
import { shortenNumber } from '@/utils/shortenNumber.util'
import { Flex, Divider, Text, Input } from '@chakra-ui/react'

import { EOSLogo1 } from '../icons/eos-logo-1'

type DestinationInfoType = {
  selectedToken: Token
  getEstimatedArrivingAmount: () => number
  inputRef: LegacyRef<HTMLInputElement> | undefined
  isBalanceZero: () => boolean
  handleSetInputAddressOrAccount: (value: string) => void
  handleEOSLoginAndLogout: () => void
  authContext: AuthContextType
}

const DestinationInfo = ({
  selectedToken,
  getEstimatedArrivingAmount,
  inputRef,
  isBalanceZero,
  handleSetInputAddressOrAccount,
  handleEOSLoginAndLogout,
  authContext,
}: DestinationInfoType) => {
  return (
    <Flex direction="column" gap="3">
      <Flex gap="2.5" align="center">
        <Text fontSize="sm" fontWeight="medium" color="fadedText4">
          Transfering to
        </Text>
        <Text fontSize="md" fontWeight="medium" color="tooltipColor">
          {selectedToken?.to.label}
        </Text>
      </Flex>
      <Flex p="3" pr="5" rounded="lg" border="solid 1px" borderColor="divider">
        <Flex direction="column" gap="1.5">
          <Text fontWeight="medium" color="fadedText4" fontSize="sm">
            Receive (estimated):
          </Text>
          <Flex gap="1" align="center">
            <Text color="fadedText4" fontSize="xs">
              (~${shortenNumber(getEstimatedArrivingAmount())})
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        rounded="lg"
        border="solid 1px"
        borderColor="divider"
        direction="column"
      >
        <Flex direction="column" gap="1.5" maxW="full" p="3">
          <Text color="fadedText4" fontSize="sm" fontWeight="medium">
            Receiver’s{' '}
            {selectedToken.to.id === TokenId.EOS ? 'account' : 'wallet address'}
          </Text>
          <Input
            ref={inputRef}
            sx={{
              all: 'unset',
              fontWeight: 'semibold',
              fontSize: { base: 'sm', md: 'md' },
            }}
            type="string"
            disabled={isBalanceZero()}
            onChange={(e) => handleSetInputAddressOrAccount(e.target.value)}
            placeholder="0xd0255686A0Y79CC0064AF3e4Cab571B523D"
            _placeholder={{ opacity: 0.4, color: 'inherit' }}
          />
        </Flex>
        {selectedToken.id === TokenId.EOS ? (
          <>
            <Divider mt="1" />
            <Flex
              onClick={handleEOSLoginAndLogout}
              gap="2"
              align="center"
              p="3"
            >
              <Text
                cursor="pointer"
                ml="auto"
                color="brandText"
                fontSize="xs"
                _hover={{
                  textDecoration: 'underline',
                }}
                fontWeight="medium"
              >
                {authContext.activeUser
                  ? `${authContext.message} | Click to logout`
                  : 'Connect EOS wallet to bridge tokens'}
              </Text>
              <EOSLogo1 color="brandText" />
            </Flex>
          </>
        ) : null}
      </Flex>
    </Flex>
  )
}

export default DestinationInfo
