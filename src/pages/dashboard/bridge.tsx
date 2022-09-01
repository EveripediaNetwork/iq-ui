import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { DashboardLayout } from '@/components/dashboard/layout'
import { EOSLogo1 } from '@/components/icons/eos-logo-1'
import { Swap } from '@/components/icons/swap'
import {
  Badge,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  chakra,
  useToast,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useAccount } from 'wagmi'
import { UALContext } from 'ual-reactjs-renderer'
import * as Humanize from 'humanize-plus'

import { getUserTokenBalance } from '@/utils/eos.util'
import { useBridge } from '@/hooks/useBridge'
import {
  AuthContextType,
  getToken,
  initialBalances,
  TokenId,
  TOKENS,
} from '@/types/bridge'
import { getDollarValue } from '@/utils/LockOverviewUtils'
import { IQEosLogo } from '@/components/iq-eos-logo'
import { IQEthLogo } from '@/components/iq-eth-logo'

const Bridge: NextPage = () => {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0])
  const [selectedTokenIcon, setSelectedTokenIcon] = useState(<IQEosLogo />)
  const [tokenInputAmount, setTokenInputAmount] = useState<string>()
  const [inputAddress, setInputAddress] = useState<string>()
  const [exchangeRate, setExchangeRate] = useState(0)
  const { address, isConnected } = useAccount()
  const [balances, setBalances] = useState(initialBalances)
  const [isTransferring, setIsTransferring] = useState(false)
  const authContext = useContext<AuthContextType>(UALContext)
  const toast = useToast()
  const {
    iqBalanceOnEth,
    pIQBalance,
    bridgeFromEthToEos,
    bridgeFromPTokenToEth,
  } = useBridge()

  const handlePathChange = (id: TokenId) =>
    setSelectedToken(getToken(id) || TOKENS[0])

  const handleTransfer = async () => {
    setIsTransferring(true)

    if (!tokenInputAmount || Number(tokenInputAmount) === 0) return
    if (selectedToken.id === TokenId.IQ) {
      const result = await bridgeFromEthToEos(
        tokenInputAmount,
        authContext.activeUser.accountName,
      )
      await result.wait()
      toast({
        title: 'IQ bridged successfully to EOS',
        position: 'top-right',
        isClosable: true,
        status: 'success',
      })
    }
    if (selectedToken.id === TokenId.PIQ) {
      const result = await bridgeFromPTokenToEth(tokenInputAmount)
      await result.wait()
      toast({
        title: 'Ptokens bridged successfully',
        position: 'top-right',
        isClosable: true,
        status: 'success',
      })
    }

    setIsTransferring(false)
  }

  const getSpecificBalance = (id: TokenId, shorten = true) => {
    if (id) {
      const balance = balances.find(b => b.id === id)?.balance
      if (Number(balance) > 1e8 && shorten)
        return `${balance?.substring(0, 9)}...`

      return balances.find(b => b.id === id)?.balance
    }

    return 0
  }

  const checkIfSelectedTokenBalanceIsZero = () =>
    Number(getSpecificBalance(selectedToken.id)) === 0

  const getReceiversAddressOrAccount = () => {
    const toToken = selectedToken.to

    if (toToken.id === TokenId.EOS)
      return authContext.activeUser.accountName || 'myeosaccount'
    if (
      (toToken.id === TokenId.IQ || toToken.id === TokenId.PIQ) &&
      isConnected
    )
      return address
    return '0xAe65930180ef4...' // random addr as an example
  }

  const getIQonEosBalance = async () => {
    const balance = await getUserTokenBalance(authContext)
    if (balance)
      setBalances(
        balances.map(b => {
          if (b.id === TokenId.EOS)
            b.balance = balance.toString().replace(' IQ', '')

          return b
        }),
      )
  }

  const getEstimatedArrivingAmount = (): number => {
    if (!tokenInputAmount) return 0

    const arrivingAmount =
      (Number(tokenInputAmount) - Number(tokenInputAmount) * 0.05) *
      exchangeRate

    return arrivingAmount
  }

  useEffect(() => {
    if (selectedToken.id === TokenId.IQ) setSelectedTokenIcon(<IQEthLogo />)
    else setSelectedTokenIcon(<IQEosLogo />)
  }, [selectedToken])

  useEffect(() => {
    if (pIQBalance)
      setBalances(
        balances.map(b => {
          if (b.id === TokenId.PIQ) b.balance = pIQBalance

          return b
        }),
      )
  }, [pIQBalance])

  useEffect(() => {
    if (iqBalanceOnEth)
      setBalances(
        balances.map(b => {
          if (b.id === TokenId.IQ) b.balance = iqBalanceOnEth

          return b
        }),
      )
  }, [iqBalanceOnEth])

  useEffect(() => {
    if (authContext.activeUser) {
      getIQonEosBalance()
    }
  }, [authContext])

  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await getDollarValue()
      setExchangeRate(rate)
    }
    if (!exchangeRate) {
      getExchangeRate()
    }
  }, [exchangeRate])

  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="8" pb="16">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Bridge
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Transfer the tokens and assets across different blockchain networks.
          </Text>
        </Flex>
        <Flex
          maxW="524px"
          w="full"
          p="5"
          mx="auto"
          rounded="lg"
          border="solid 1px"
          borderColor="divider"
          direction="column"
          gap="6"
        >
          <Flex gap="2.5" align="center">
            <Text fontSize="xs" color="grayText2">
              Transfer From
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                fontSize="sm"
                size="xs"
                fontWeight="medium"
                sx={{
                  span: {
                    display: 'flex',
                    gap: '2',
                    alignItems: 'center',
                  },
                }}
              >
                {selectedTokenIcon}
                {/* <BraindaoLogo3 boxSize="4" /> */}
                <Text>{selectedToken?.label}</Text>
                <Icon fontSize="xs" as={FaChevronDown} />
              </MenuButton>
              <MenuList>
                {TOKENS.filter(tok => tok.id !== selectedToken?.id).map(tok => (
                  <MenuItem
                    key={tok.id}
                    onClick={() => handlePathChange(tok.id)}
                  >
                    {tok.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
          <Flex
            p="3"
            pr="5"
            rounded="lg"
            border="solid 1px"
            borderColor="divider"
          >
            <Flex direction="column" gap="1.5">
              <Text color="grayText2" fontSize="xs">
                Send:
              </Text>
              <Flex direction="column" gap="1" align="start">
                <chakra.input
                  sx={{
                    all: 'unset',
                    fontWeight: 'semibold',
                    w: '25',
                  }}
                  disabled={checkIfSelectedTokenBalanceIsZero()}
                  placeholder="00.00"
                  type="number"
                  value={tokenInputAmount}
                  onChange={e => setTokenInputAmount(e.target.value)}
                  autoFocus
                />
                <Text align="left" color="grayText2" fontSize="xs">
                  (~$
                  {Humanize.formatNumber(
                    Number(tokenInputAmount) * exchangeRate || 0.0,
                    2,
                  )}
                  )
                </Text>
              </Flex>
            </Flex>

            <Flex direction="column" ml="auto" align="end" gap="1">
              <Flex gap="1" align="center">
                <Text
                  onClick={() =>
                    setTokenInputAmount(
                      getSpecificBalance(selectedToken?.id, false) || '0',
                    )
                  }
                  color="grayText2"
                  cursor="pointer"
                  fontSize="xs"
                >
                  Balance: {getSpecificBalance(selectedToken?.id)}
                </Text>
                <Badge
                  variant="solid"
                  bg="brand.50"
                  color="brandText"
                  _dark={{
                    bg: 'brand.200',
                  }}
                  colorScheme="brand"
                  rounded="md"
                  fontWeight="normal"
                >
                  MAX
                </Badge>
              </Flex>
              <Flex gap="1" align="center">
                <BraindaoLogo3 w="6" h="5" />
                {/* <Text>{getToken(TokenId.IQ)?.label}</Text> */}
              </Flex>
            </Flex>
          </Flex>
          <IconButton
            icon={<Swap />}
            aria-label="Swap"
            variant="outline"
            w="fit-content"
            mx="auto"
            color="brandText"
            onClick={() => handlePathChange(selectedToken.to.id)}
          />

          <Flex gap="2.5" align="center">
            <Text fontSize="xs">Transfering to</Text>
            <Text>{selectedToken?.to.label}</Text>
          </Flex>

          <Flex direction="column" gap="3">
            <Flex
              p="3"
              pr="5"
              rounded="lg"
              border="solid 1px"
              borderColor="divider"
            >
              <Flex direction="column" gap="1.5">
                <Text color="grayText2" fontSize="xs">
                  Receive (estimated):
                </Text>
                <Flex gap="1" align="center">
                  <Text color="grayText2" fontSize="xs">
                    (~${getEstimatedArrivingAmount()})
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
                <Text color="grayText2" fontSize="xs">
                  Receiver’s{' '}
                  {selectedToken.to.id === TokenId.EOS
                    ? 'account'
                    : 'wallet address'}
                </Text>
                <chakra.input
                  sx={{
                    all: 'unset',
                    fontWeight: 'semibold',
                    fontSize: { base: 'sm', md: 'md' },
                  }}
                  type="number"
                  disabled={checkIfSelectedTokenBalanceIsZero()}
                  placeholder={getReceiversAddressOrAccount()}
                  value={inputAddress}
                  onChange={e => setInputAddress(e.target.value)}
                />
              </Flex>
              {selectedToken.id === TokenId.EOS ? (
                <>
                  <Divider mt="1" />
                  <Flex
                    onClick={authContext.showModal}
                    gap="2"
                    align="center"
                    p="3"
                  >
                    <Text ml="auto" color="brandText" fontSize="xs">
                      {authContext.activeUser
                        ? authContext.message
                        : 'connect EOS wallet to bridge tokens'}
                    </Text>
                    <EOSLogo1 color="brandText" />
                  </Flex>
                </>
              ) : null}
            </Flex>
          </Flex>

          <Flex direction="column" gap="4" fontSize="xs">
            <Flex align="center">
              <Text color="grayText2">Estimated transfer time </Text>
              <Text fontWeight="semibold" ml="auto">
                ~5min
              </Text>
            </Flex>
            <Flex align="center">
              <Text color="grayText2">Platform Fee</Text>
              <Text fontWeight="semibold" ml="auto">
                0.25%
              </Text>
            </Flex>
          </Flex>
          <Button
            disabled={checkIfSelectedTokenBalanceIsZero()}
            isLoading={isTransferring}
            onClick={handleTransfer}
          >
            Transfer
          </Button>
        </Flex>
      </Flex>
    </DashboardLayout>
  )
}

export default Bridge
