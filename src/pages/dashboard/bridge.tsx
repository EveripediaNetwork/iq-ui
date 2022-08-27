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
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { RiEditLine } from 'react-icons/ri'
import { useAccount, useContractWrite } from 'wagmi'
import { utils } from 'ethers'
import { UALContext } from 'ual-reactjs-renderer'

import { ptokenAbi } from '@/abis/ptoken.abi'
import { getUserTokenBalance } from '@/utils/eos.util'
import { useBridge } from '@/hooks/useBridge'
import { AuthContextType, getToken, initialBalances, TokenId, TOKENS } from '@/types/bridge'

const Bridge: NextPage = () => {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0])
  const [sendPrice, setSendPrice] = useState<string>()
  const [inputAddress, setInputAddress] = useState<string>()
  const { address, isConnected } = useAccount()
  const [balances, setBalances] = useState(initialBalances)
  const authContext = useContext<AuthContextType>(UALContext)
  const { iqBalanceOnEth, pIQBalance } = useBridge()

  const handlePathChange = (id: TokenId) =>
    setSelectedToken(getToken(id) || TOKENS[0])

  const { write: redeem } = useContractWrite({
    addressOrName: '0xbff1365cf0a67431484c00c63bf14cfd9abbce5d', // TODO: move to env
    contractInterface: ptokenAbi,
    functionName: 'redeem',
  })

  const handleIQfromEOStoETH = async () => {
    // const balance =
  }

  const handleReverseIQtoEOS = async () => {
    const amountParsed = utils.parseEther('1').toString()
    // 1
    // burn({ args: [amountParsed] })

    // 2
    const eosAccount = 'imjustincast' // TODO: use the EOS input account from the user
    redeem({ args: [amountParsed, eosAccount] })

    // 3
    // handle the results accordingly
  }

  const getSpecificBalance = (id: TokenId, shorten = true) => {
    if (id) {
      const b = balances.find(b => b.id === id)?.balance
      if (Number(b) > 1e8 && shorten) return `${b?.substring(0, 9)}...`

      return balances.find(b => b.id === id)?.balance
    }
  }

  const getReceiversWalletOrAccount = () => {
    const toToken = selectedToken.to

    console.log(authContext)

    if (toToken.id === TokenId.EOS)
      return authContext.activeUser.accountName || 'myeosaccount'
    else if ((toToken.id === TokenId.IQ || toToken.id === TokenId.PIQ) && isConnected)
      return address
    else
      return "0xAe65930180ef4..." // random addr as an example

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
                <BraindaoLogo3 boxSize="4" />
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
              <Flex gap="1" align="center">
                <chakra.input
                  sx={{
                    all: 'unset',
                    fontWeight: 'semibold',
                    w: '25',
                  }}
                  placeholder="00.00"
                  value={sendPrice}
                  onChange={e => setSendPrice(e.target.value)}
                  autoFocus
                />
                <Text color="grayText2" fontSize="xs">
                  (~$00.00)
                </Text>
              </Flex>
            </Flex>

            <Flex direction="column" ml="auto" align="end" gap="1">
              <Flex gap="1" align="center">
                <Text
                  onClick={() =>
                    setSendPrice(getSpecificBalance(selectedToken?.id, false))
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
                  <Text
                    fontWeight="semibold"
                  //  color={receivePrice ? 'inherit' : 'grayText2'}
                  >
                    {/* //TODO We'll subtract platform fee and it should also reflect in the dollar price below */}
                    {/* {receivePrice?.toFixed(2) || '00.00'} */}
                  </Text>
                  <Text color="grayText2" fontSize="xs">
                    (~$234.00)
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
                  Receiver’s {selectedToken.to.id === TokenId.EOS ? 'account' : 'wallet address'}
                </Text>
                <chakra.input
                  sx={{
                    all: 'unset',
                    fontWeight: 'semibold',
                    fontSize: { base: 'sm', md: 'md' },
                  }}
                  placeholder={getReceiversWalletOrAccount()}
                  value={inputAddress}
                  onChange={e => setInputAddress(e.target.value)}
                />
              </Flex>
              {
                selectedToken.id === TokenId.EOS ? (
                  <>
                    <Divider mt="1" />
                    <Flex onClick={authContext.showModal} gap="2" align="center" p="3">
                      <Text ml="auto" color="brandText" fontSize="xs">
                        {authContext.activeUser.accountName ? authContext.message : 'connect EOS wallet to bridge tokens'}
                      </Text>
                      <EOSLogo1 color="brandText" />
                    </Flex>
                  </>
                ) : null
              }
            </Flex>
          </Flex>

          <Flex direction="column" gap="4" fontSize="xs">
            <Flex align="center">
              <Text color="grayText2">Slippage tolerance </Text>
              <Flex align="center" gap="1.5" ml="auto">
                <Text fontWeight="semibold">3.00%</Text>
                <Icon color="brandText" as={RiEditLine} />
              </Flex>
            </Flex>
            <Flex align="center">
              <Text color="grayText2">Estimated transfer time </Text>
              <Text fontWeight="semibold" ml="auto">
                45min
              </Text>
            </Flex>
            <Flex align="center">
              <Text color="grayText2">Platform Fee</Text>
              <Text fontWeight="semibold" ml="auto">
                $34
              </Text>
            </Flex>
          </Flex>
          <Button>Transfer</Button>
        </Flex>
      </Flex>
    </DashboardLayout>
  )
}

export default Bridge
