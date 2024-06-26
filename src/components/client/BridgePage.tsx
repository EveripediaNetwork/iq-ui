'use client'
import { Button, Flex, IconButton } from '@chakra-ui/react'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { UALContext } from 'ual-reactjs-renderer'
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
import { Swap } from '@/components/icons/swap'
import { useGetIqPriceQuery } from '@/services/iqPrice'
import { getError } from '@/utils/getError'
import NetworkErrorNotification from '@/components/lock/NetworkErrorNotification'
import CardFooter from '@/components/bridge/cardFooter'
import DestinationInfo from '@/components/bridge/destinationInfo'
import OriginInfo from '@/components/bridge/originInfo'
import config from '@/config'
import TokenMenuLayout from '@/components/bridge/tokenMenuLayout'
import { useReusableToast } from '@/hooks/useToast'
import PageHeader from '../dashboard/PageHeader'
import * as Humanize from 'humanize-plus'
import { PTOKEN_COMMISSION, TRANSFER_LOWER_LIMIT } from '@/data/BridgeConstant'
import Disclaimer from '../bridge/Disclaimer'
import { usePostHog } from 'posthog-js/react'

const BridgePage = () => {
  const authContext = useContext<AuthContextType>(UALContext)
  const { activeUser, logout, showModal } = authContext
  const { accountName = '' } = activeUser ?? {}
  const [selectedToken, setSelectedToken] = useState(TOKENS[0])
  const [selectedTokenIcon, setSelectedTokenIcon] = useState(<IQEosLogo />)
  const [tokenInputAmount, setTokenInputAmount] = useState<string>('0')
  const [inputAddress, setInputAddress] = useState<string>()
  const [inputAccount, setInputAccount] = useState<string>(
    activeUser ? accountName : '',
  )
  const [openErrorNetwork, setOpenErrorNetwork] = useState(false)
  const [balances, setBalances] = useState(initialBalances)
  const [isTransferring, setIsTransferring] = useState(false)
  const { showToast } = useReusableToast()
  const { address, isConnected, isDisconnected } = useAccount()
  const { switchNetwork, isSuccess } = useSwitchNetwork()
  const { chain } = useNetwork()
  const chainId = parseInt(config.chainId)
  const { data } = useGetIqPriceQuery('IQ')
  const exchangeRate = data?.response?.[0]?.quote?.USD?.price || 0.0
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    iqBalanceOnEth,
    pIQBalance,
    bridgeFromEthToEos,
    bridgeFromPTokenToEth,
    pIQTokenBalance,
  } = useBridge()
  const posthog = usePostHog()

  const handleError = (errorMsg: string) => {
    showToast(errorMsg, 'error')
    setIsTransferring(false)
    setIsTransferring(false)
  }

  const handleTransfer = async () => {
    setIsTransferring(true)

    if (!tokenInputAmount || Number(tokenInputAmount) === 0) {
      handleError('Amount cannot be empty')
      return
    }

    if (Number(tokenInputAmount) * exchangeRate < TRANSFER_LOWER_LIMIT) {
      handleError('The minimum transfer amount is $20')
      return
    }

    let isError = false
    if (selectedToken.id === TokenId.EOS) {
      if (!inputAddress) {
        showToast('Address cannot be empty', 'error')
        return
      }
      try {
        await convertTokensTx(
          `${parseFloat(tokenInputAmount).toFixed(3)} IQ`,
          inputAddress,
          authContext,
        )
        showToast(
          'Tokens successfully bridge from EOS to the Ptoken bridge',
          'success',
        )
      } catch (error) {
        showToast(getError(error).error, 'error')
      }
    }

    if (selectedToken.id === TokenId.PIQ) {
      const { error } = await bridgeFromPTokenToEth(tokenInputAmount)
      if (error) isError = true
      showToast(
        error ?? 'Ptokens bridged successfully',
        error ? 'error' : 'success',
      )
    }

    if (selectedToken.id === TokenId.IQ) {
      if (!inputAccount) {
        handleError('Address cannot be empty')
        return
      }
      const { error } = await bridgeFromEthToEos(tokenInputAmount, inputAccount)

      if (error) isError = true
      showToast(
        error ?? 'IQ bridged successfully to EOS',
        error ? 'error' : 'success',
      )
    }

    posthog.capture('bridge_transaction', {
      action: isError ? 'TOKEN_BRIDGE_ERROR' : 'TOKEN_BRIDGE_SUCCESS',
      label: JSON.stringify(inputAddress),
      category: isError ? 'token_bridge_error' : 'token_bridge_success',
    })

    setIsTransferring(false)
    setTokenInputAmount('0')
  }

  const getSpecificBalance = (id: TokenId) => {
    if (id) return parseInt(balances.find((b) => b.id === id)?.balance || '')

    return 0
  }

  const isBalanceZero = () => Number(getSpecificBalance(selectedToken.id)) === 0

  const disableButton = () => {
    if (isBalanceZero()) return true

    // # EOS
    if (selectedToken.id === TokenId.EOS) {
      // if disconnected
      if (!activeUser) return true
    }

    // # PIQ
    if (selectedToken.id === TokenId.PIQ && isDisconnected) return true

    // # IQ - PIQ
    if (
      (selectedToken.to.id === TokenId.IQ ||
        selectedToken.to.id === TokenId.PIQ) &&
      (!inputAddress || inputAddress === '')
    )
      return true

    // # IQ
    if (selectedToken.id === TokenId.IQ) {
      if (isDisconnected || !inputAccount || inputAccount === '') return true
    }

    // check the input amount
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
    if (toToken.id === TokenId.EOS && activeUser) return accountName
    if (
      (toToken.id === TokenId.IQ || toToken.id === TokenId.PIQ) &&
      isConnected
    )
      return address
    return null
  }

  const handlePathChange = (id: TokenId) => {
    setSelectedToken(() => getToken(id) || TOKENS[0])
  }

  const getEstimatedArrivingAmount = (): number => {
    if (!tokenInputAmount) return 0
    if (selectedToken.id === 'piq' || selectedToken.to.id === 'piq') {
      const arrivingAmount =
        (Number(tokenInputAmount) -
          Number(tokenInputAmount) * PTOKEN_COMMISSION) *
        exchangeRate
      return Number(arrivingAmount.toFixed(3))
    }
    const arrivingAmount = Number(tokenInputAmount) * exchangeRate
    return Number(arrivingAmount.toFixed(3))
  }

  const handleNetworkSwitch = () => {
    if (switchNetwork) switchNetwork(chainId)
  }

  const handleSetInputAddressOrAccount = (value: string) => {
    if (selectedToken.to.id === TokenId.EOS) {
      setInputAccount(value)
      setInputAddress(value)
    } else setInputAddress(value)
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
    if (!activeUser) showModal()
    else logout()
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
    if (inputRef.current) {
      inputRef.current.value = getReceiversAddressOrAccount() || ''
      handleSetInputAddressOrAccount(inputRef.current.value)
    }

    if (selectedToken.id === TokenId.IQ) setSelectedTokenIcon(<IQEthLogo />)
    else setSelectedTokenIcon(<IQEosLogo />)
  }, [selectedToken, isConnected])

  useEffect(() => {
    if (pIQBalance)
      setBalances((currentBalances) =>
        currentBalances.map((b) => {
          if (b.id === TokenId.PIQ) b.balance = pIQBalance

          return b
        }),
      )
  }, [pIQBalance])

  useEffect(() => {
    if (iqBalanceOnEth)
      setBalances((currentBalances) =>
        currentBalances.map((b) => {
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
          balances.map((b) => {
            if (b.id === TokenId.EOS)
              b.balance = balance.toString().replace(' IQ', '')
            return b
          }),
        )
    }
    if (activeUser) getIQonEosBalance()
  }, [authContext])

  return (
    <>
      <Flex direction={{ base: 'column', xl: 'row' }}>
        <Flex
          pr={{ lg: 8 }}
          flex={1}
          direction="column"
          gap="4"
          border="solid 1px transparent"
          minH="calc(100vh - 70px)"
          borderRightColor={{ xl: 'divider' }}
          pt={{ base: '5', lg: '6' }}
        >
          <PageHeader
            header="IQ Bridge"
            body="Transfer IQ from EOS to ETH and vice versa using this bridge.
          Swapping to pIQ is an intermediary step."
            tooltipLabel="pTokens Dapp- Official bridge interface"
            externalLink="https://dapp.ptokens.io/#/swap?asset=iq&from=eth&to=eos"
          />
          <Disclaimer />
          <Flex
            maxW="524px"
            w="full"
            p="5"
            mx={{ md: '40px', lg: '70px ' }}
            rounded="lg"
            border="solid 1px"
            borderColor="divider"
            direction="column"
            gap="6"
            mb={{ base: '10', md: '0' }}
          >
            <TokenMenuLayout
              selectedTokenIcon={selectedTokenIcon}
              selectedToken={selectedToken}
              handlePathChange={handlePathChange}
            />
            <OriginInfo
              selectedToken={selectedToken}
              isBalanceZero={isBalanceZero}
              tokenInputAmount={tokenInputAmount}
              setTokenInputAmount={setTokenInputAmount}
              getSpecificBalance={getSpecificBalance}
            />
            <IconButton
              icon={<Swap />}
              aria-label="Swap"
              variant="outline"
              w="fit-content"
              mx="auto"
              color="brandText"
              onClick={() => handlePathChange(selectedToken.to.id)}
            />

            <Flex direction="column" gap="3">
              <DestinationInfo
                selectedToken={selectedToken}
                getEstimatedArrivingAmount={getEstimatedArrivingAmount}
                inputRef={inputRef}
                isBalanceZero={isBalanceZero}
                handleSetInputAddressOrAccount={handleSetInputAddressOrAccount}
                handleEOSLoginAndLogout={handleEOSLoginAndLogout}
                authContext={authContext}
              />
            </Flex>
            <CardFooter
              pIQbalance={Humanize.formatNumber(
                pIQTokenBalance * exchangeRate,
                2,
              )}
              selectedToken={selectedToken}
            />
            <Button
              isDisabled={disableButton()}
              isLoading={isTransferring}
              onClick={handleTransfer}
              _hover={{
                boxShadow: 'none',
              }}
            >
              Transfer
            </Button>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          gap="4"
          border="solid 1px transparent"
          borderTopColor={{ base: 'divider', xl: 'transparent' }}
          pb={{ base: '20', lg: '8' }}
          pt={8}
          px={{ base: '2', md: '8' }}
          fontSize="md"
          color="fadedText4"
          textAlign={{ base: 'center', lg: 'left' }}
          maxW={{ xl: '25.875em' }}
          minW="18.75em"
        >
          <p>
            Transfer IQ from EOS to ETH and vice versa using this bridge.
            Swapping to pIQ is an intermediary step.
          </p>
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

export default BridgePage
