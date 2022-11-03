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
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { UALContext } from 'ual-reactjs-renderer'
import { NextSeo } from 'next-seo'
import { convertTokensTx, getUserTokenBalance } from '@/utils/eos.util'
import { useBridge } from '@/hooks/useBridge'
import {
  AuthContextType,
  getToken,
  initialBalances,
  TokenId,
  TOKENS,
} from '@/types/bridge'
import { IQEosLogo } from '@/components/iq-eos-logo'
import { IQEthLogo } from '@/components/iq-eth-logo'
import config from '@/config'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { EOSLogo1 } from '@/components/icons/eos-logo-1'
import { Swap } from '@/components/icons/swap'
import NetworkErrorNotification from '@/components/lock/NetworkErrorNotification'
import { shortenNumber } from '@/utils/shortenNumber.util'
import { logEvent } from '@/utils/googleAnalytics'
import { useIQRate } from '@/hooks/useRate'

const Bridge: NextPage = () => {
  const authContext = useContext<AuthContextType>(UALContext)
  const [selectedToken, setSelectedToken] = useState(TOKENS[0])
  const [selectedTokenIcon, setSelectedTokenIcon] = useState(<IQEosLogo />)
  const [tokenInputAmount, setTokenInputAmount] = useState<string>()
  const [inputAddress, setInputAddress] = useState<string>()
  const [inputAccount, setInputAccount] = useState<string>(
    authContext.activeUser ? authContext.activeUser.accountName : '',
  )
  const [openErrorNetwork, setOpenErrorNetwork] = useState(false)
  const [balances, setBalances] = useState(initialBalances)
  const [isTransferring, setIsTransferring] = useState(false)
  const toast = useToast()
  const { address, isConnected, isDisconnected } = useAccount()
  const { switchNetwork, isSuccess } = useSwitchNetwork()
  const { chain } = useNetwork()
  const chainId = parseInt(config.chainId)
  const { rate: exchangeRate } = useIQRate()

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
      const result = await bridgeFromEthToEos(tokenInputAmount, inputAccount)
      await result.wait()

      toast({
        title: 'IQ bridged successfully to EOS',
        position: 'top-right',
        isClosable: true,
        status: 'success',
      })
    }

    if (selectedToken.id === TokenId.EOS) {
      await convertTokensTx(
        `${parseFloat(tokenInputAmount).toFixed(3)} IQ`,
        address || '',
        authContext,
      )

      toast({
        title: 'Tokens successfully bridge from EOS to the Ptoken bridge',
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

    logEvent({
      action: 'TOKEN_BRIDGE_SUCCESS',
      label: JSON.stringify(address),
      value: 1,
      category: 'token_bridge_success',
    })

    setIsTransferring(false)
  }

  const getSpecificBalance = (id: TokenId) => {
    if (id) return Number(balances.find(b => b.id === id)?.balance)

    return 0
  }

  const checkIfSelectedTokenBalanceIsZero = () =>
    Number(getSpecificBalance(selectedToken.id)) === 0

  const disableButton = () => {
    if (checkIfSelectedTokenBalanceIsZero()) return true

    if (selectedToken.id === TokenId.EOS && !authContext.activeUser) return true

    if (
      selectedToken.to.id === TokenId.EOS &&
      (!inputAccount || inputAccount === '')
    )
      return true

    if (
      (selectedToken.to.id === TokenId.IQ ||
        selectedToken.to.id === TokenId.PIQ) &&
      (!inputAddress || inputAddress === '')
    )
      return true

    if (selectedToken.id === TokenId.PIQ && isDisconnected) return true

    if (selectedToken.id === TokenId.IQ && isDisconnected) return true

    if (
      !tokenInputAmount ||
      tokenInputAmount === '' ||
      Number(tokenInputAmount) <= 0
    )
      return true

    if (isTransferring) return true

    return false
  }

  const getReceiversAddressOrAccount = () => {
    const toToken = selectedToken.to

    if (toToken.id === TokenId.EOS && !authContext.activeUser)
      return 'myeosaccount'
    if (toToken.id === TokenId.EOS && authContext.activeUser)
      return authContext.activeUser.accountName
    if (
      (toToken.id === TokenId.IQ || toToken.id === TokenId.PIQ) &&
      isConnected
    )
      return address
    return '0xAe65930180ef4...' // random addr as an example
  }

  const getEstimatedArrivingAmount = (): number => {
    if (!tokenInputAmount) return 0

    const arrivingAmount =
      (Number(tokenInputAmount) - Number(tokenInputAmount) * 0.05) *
      exchangeRate

    return arrivingAmount
  }

  const handleNetworkSwitch = () => {
    if (switchNetwork) switchNetwork(chainId)
  }

  const handleSetInputAddressOrAccount = (value: string) => {
    if (selectedToken.to.id === TokenId.EOS) setInputAccount(value)
    else setInputAddress(value)
  }

  const handleChainChanged = useCallback(
    (chainDetails: number | undefined) => {
      if (chainDetails && chainDetails !== chainId) {
        setOpenErrorNetwork(true)
      }
    },
    [chainId],
  )

  const handleEOSLoginAndLogout = () => {
    if (!authContext.activeUser) authContext.showModal()
    else authContext.logout()
  }

  useEffect(() => {
    if (chain?.id !== chainId) {
      handleChainChanged(chain?.id)
    }
    if (isSuccess && chainId === chain?.id) {
      setOpenErrorNetwork(false)
    }
  }, [chain, handleChainChanged, isSuccess, chainId])

  useEffect(() => {
    if (selectedToken.id === TokenId.IQ) setSelectedTokenIcon(<IQEthLogo />)
    else setSelectedTokenIcon(<IQEosLogo />)
  }, [selectedToken])

  useEffect(() => {
    if (pIQBalance)
      setBalances(currentBalances =>
        currentBalances.map(b => {
          if (b.id === TokenId.PIQ) b.balance = pIQBalance

          return b
        }),
      )
  }, [pIQBalance])

  useEffect(() => {
    if (iqBalanceOnEth)
      setBalances(currentBalances =>
        currentBalances.map(b => {
          if (b.id === TokenId.IQ) b.balance = iqBalanceOnEth

          return b
        }),
      )
  }, [iqBalanceOnEth])

  useEffect(() => {
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

    if (authContext.activeUser) getIQonEosBalance()
  }, [authContext, balances])

  return (
    <>
      <NextSeo
        title="Bridge Page"
        description="Transfer IQ from EOS to ETH and vice versa using this bridge. Swapping to pIQ is an intermediary step."
        openGraph={{
          title: 'IQ Bridge',
          description:
            'Transfer IQ from EOS to ETH and vice versa using this bridge. Swapping to pIQ is an intermediary step. ',
        }}
      />
      <Flex py={{ base: '5', lg: '6' }} direction="column" gap="6" pb="16">
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Bridge
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fadedText4"
            fontWeight="medium"
          >
            Transfer IQ from EOS to ETH and vice versa using this bridge.
            Swapping to pIQ is an intermediary step.
          </Text>
        </Flex>
        <Flex
          maxW="524px"
          w="full"
          p="5"
          mx={{ md: '40px', lg: '110px ' }}
          rounded="lg"
          border="solid 1px"
          borderColor="divider"
          direction="column"
          gap="6"
          mb={{ base: '10', md: '0' }}
        >
          <Flex gap="2.5" align="center">
            <Text fontSize="sm" color="fadedText4" fontWeight="medium">
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
                <Text fontSize="md" fontWeight="medium">
                  {selectedToken?.label}
                </Text>
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
              <Text color="fadedText4" fontSize="xs" fontWeight="medium">
                Send:
              </Text>
              <Flex gap="1" align="center">
                <chakra.input
                  sx={{
                    all: 'unset',
                    fontWeight: 'semibold',
                    w: '14',
                    color: 'fadedText4',
                  }}
                  disabled={checkIfSelectedTokenBalanceIsZero()}
                  placeholder="00.00"
                  type="number"
                  value={tokenInputAmount}
                  onChange={e => String(setTokenInputAmount(e.target.value))}
                  autoFocus
                />
                <Text
                  align="left"
                  color="fadedText4"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  (~$
                  {shortenNumber(
                    Number(tokenInputAmount) * exchangeRate || 0.0,
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
                      String(getSpecificBalance(selectedToken?.id)) || '0',
                    )
                  }
                  color="fadedText4"
                  cursor="pointer"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  Balance: {shortenNumber(getSpecificBalance(selectedToken.id))}
                </Text>
                <Badge
                  onClick={() =>
                    setTokenInputAmount(
                      String(getSpecificBalance(selectedToken?.id)) || '0',
                    )
                  }
                  cursor="pointer"
                  _hover={{
                    fontWeight: 'bold',
                  }}
                  variant="solid"
                  bg="brand.50"
                  color="brandText"
                  _dark={{
                    bg: 'brand.200',
                  }}
                  colorScheme="brand"
                  rounded="md"
                  fontWeight="medium"
                >
                  MAX
                </Badge>
              </Flex>
              <Flex gap="1" align="center">
                <BraindaoLogo3 w="6" h="5" />
                <Text fontSize="md" fontWeight="medium">
                  {getToken(TokenId.IQ)?.label}
                </Text>
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
            <Text fontSize="sm" fontWeight="medium" color="fadedText4">
              Transfering to
            </Text>
            <Text fontSize="md" fontWeight="medium" color="tooltipColor">
              {selectedToken?.to.label}
            </Text>
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
                  type="string"
                  disabled={checkIfSelectedTokenBalanceIsZero()}
                  placeholder={getReceiversAddressOrAccount()}
                  value={getReceiversAddressOrAccount()}
                  onChange={e => handleSetInputAddressOrAccount(e.target.value)}
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
                        fontWeight: 'bold',
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

          <Flex direction="column" gap="4" fontSize="sm">
            <Flex align="center">
              <Text color="fadedText4" fontWeight="medium">
                Estimated transfer time{' '}
              </Text>
              <Text fontWeight="semibold" ml="auto">
                ~{selectedToken.to.id === TokenId.IQ ? 2 : 5}min
              </Text>
            </Flex>
            {selectedToken.to.id !== TokenId.IQ ? (
              <Flex align="center">
                <Text color="fadedText4" fontWeight="medium">
                  Platform Fee
                </Text>
                <Text fontWeight="semibold" ml="auto">
                  0.25%
                </Text>
              </Flex>
            ) : null}
          </Flex>
          <Button
            disabled={disableButton()}
            isLoading={isTransferring}
            onClick={handleTransfer}
          >
            Transfer
          </Button>
        </Flex>
      </Flex>
      <NetworkErrorNotification
        switchNetwork={handleNetworkSwitch}
        isOpen={openErrorNetwork}
        onClose={() => setOpenErrorNetwork(false)}
      />
    </>
  )
}

export default Bridge
