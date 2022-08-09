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
  Text,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { RiEditLine } from 'react-icons/ri'
import { useContractWrite } from 'wagmi'
import { utils } from 'ethers'

import { ptokenAbi } from '@/abis/ptoken.abi'
import { minterAbi } from '@/abis/minter.abi'

const Bridge: NextPage = () => {
  const { write: reverseIQtoEOS } = useContractWrite({
    addressOrName: '0xbff1365cf0a67431484c00c63bf14cfd9abbce5d', // TODO: move to env
    contractInterface: ptokenAbi,
    functionName: 'redeem'
  })

  const { data: mintResult, isLoading: isLoadingMint, write: mint } = useContractWrite({
    addressOrName: '0x483488B7D897b429AE851FEef1fA02d96475cc23', // TODO: move to env
    contractInterface: minterAbi,
    functionName: 'mint'
  })

  const { data: burnResult, isLoading: isBurning, write: burn } = useContractWrite({
    addressOrName: '0x483488B7D897b429AE851FEef1fA02d96475cc23', // TODO: move to env
    contractInterface: minterAbi,
    functionName: 'burn'
  })

  const handleReverseIQtoEOS = async () => {
    const amountParsed = utils.parseEther('1').toString()
    // 1
    await burn({ args: [amountParsed] })

    // 2
    await 
  }

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
                <Text>pIQ(EOS)</Text>
                <Icon fontSize="xs" as={FaChevronDown} />
              </MenuButton>
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
                <Text fontWeight="semibold">23.00</Text>
                <Text color="grayText2" fontSize="xs">
                  (~$234.00)
                </Text>
              </Flex>
            </Flex>

            <Flex direction="column" ml="auto" align="end" gap="1.5">
              <Flex gap="1" align="center">
                <Text color="grayText2" fontSize="xs">
                  Balance: 500.92
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
                <Text fontWeight="medium">IQ</Text>
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
          />

          <Flex gap="2.5" align="center">
            <Text fontSize="xs">Transfer to</Text>
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
                <Text>pIQ(ETH)</Text>
                <Icon fontSize="xs" as={FaChevronDown} />
              </MenuButton>
            </Menu>
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
                  <Text fontWeight="semibold">22.22</Text>
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
                  Receiver’s wallet address
                </Text>
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: 'sm', md: 'md' }}
                  noOfLines={1}
                >
                  0x03D36e9F9D652811FAF7fF799DC56E44f9391766
                </Text>
              </Flex>
              <Divider mt="1" />
              <Flex gap="2" align="center" p="3">
                <Text ml="auto" color="brandText" fontSize="xs">
                  connect EOS wallet to bridge tokens
                </Text>
                <EOSLogo1 color="brandText" />
              </Flex>
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
