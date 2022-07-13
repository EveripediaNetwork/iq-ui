import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Swap } from '@/components/icons/swap'
import {
  Badge,
  Button,
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

const Bridge: NextPage = () => {
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6">
        <Flex direction="column">
          <Heading fontWeight="bold" fontSize="2xl">
            IQ Bridge
          </Heading>
          <Text fontSize="sm" color="fadedText">
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
            <Text fontSize="xs">Transfer From</Text>
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
              <Text color="grayOnLight" fontSize="xs">
                Send:
              </Text>
              <Flex gap="1" align="center">
                <Text fontWeight="semibold">23.00</Text>
                <Text color="grayOnLight" fontSize="xs">
                  (~$234.00)
                </Text>
              </Flex>
            </Flex>

            <Flex direction="column" ml="auto" align="end" gap="1.5">
              <Flex gap="1" align="center">
                <Text color="grayOnLight" fontSize="xs">
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

          <Flex
            p="3"
            pr="5"
            rounded="lg"
            border="solid 1px"
            borderColor="divider"
          >
            <Flex direction="column" gap="1.5">
              <Text color="grayOnLight" fontSize="xs">
                Receive (estimated):
              </Text>
              <Flex gap="1" align="center">
                <Text fontWeight="semibold">22.22</Text>
                <Text color="grayOnLight" fontSize="xs">
                  (~$234.00)
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex direction="column" gap="4" fontSize="xs">
            <Flex align="center">
              <Text color="grayOnLight">Slippage tolerance </Text>
              <Flex align="center" gap="1.5" ml="auto">
                <Text fontWeight="semibold">3.00%</Text>
                <Icon color="brandText" as={RiEditLine} />
              </Flex>
            </Flex>
            <Flex align="center">
              <Text color="grayOnLight">Estimated transfer time </Text>
              <Text fontWeight="semibold" ml="auto">
                45min
              </Text>
            </Flex>
            <Flex align="center">
              <Text color="grayOnLight">Platform Fee</Text>
              <Text fontWeight="semibold" ml="auto">
                $34
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </DashboardLayout>
  )
}

export default Bridge
