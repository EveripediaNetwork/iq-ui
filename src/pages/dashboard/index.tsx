import React from 'react'
import type { NextPage } from 'next'
import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  chakra,
  GridItem,
  Divider,
} from '@chakra-ui/react'
import { Dot } from '@/components/icons/dot'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'

const Home: NextPage = () => {
  return (
    <DashboardLayout>
      <Stack h="full" mb="4.375em" spacing={{ base: 7, md: 5, lg: 6 }}>
        <Flex
          gap={{ lg: '15' }}
          px={{ base: 3, md: '5' }}
          py={{ base: 3, md: 7, lg: '2.5' }}
          pr={{ md: '6.25em' }}
          bg="cardBg"
          border="solid 1px"
          borderColor="divider"
          h="fit-content"
          rounded="lg"
          align={{ base: 'start', lg: 'center' }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Stack pt="5" order={{ base: 1, lg: 0 }}>
            <Heading fontSize={{ md: 'xl', lg: '2xl' }}>
              Welcome to the IQ Dashoard
            </Heading>
            <Text fontSize={{ base: 'sm', lg: 'md' }}>
              The IQ token is a multichain token that powers the Everipedia
              ecosystem of dapps and features. IQ token is a DeFi token that can
              be staked for hiIQ to earn rewards + yields. You can bridge your
              token from all chains IQ circulares on, using our bridge UI, and
              lots more.
            </Text>
          </Stack>
          <BraindaoLogo3 h="8.125em" w="unset" />
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
          <Stat>
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align={{ base: 'center', md: 'inherit' }}
              gap="6"
              px="22px"
              py="18px"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
            >
              <StatLabel color="brandText" fontSize="medium">
                Market Cap
              </StatLabel>
              <chakra.div
                ml={{ base: 'auto', md: 'initial' }}
                sx={{
                  '.chakra-stat__help-text': {
                    h: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    $55.89M
                  </chakra.span>
                  <StatHelpText position="relative">
                    <StatArrow type="increase" />
                    <chakra.span
                      color="green"
                      fontSize={{ base: 'xs', md: 'inherit' }}
                      mr={{ base: 1, md: 0 }}
                    >
                      0.09%
                    </chakra.span>
                  </StatHelpText>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
          <Stat>
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align={{ base: 'center', md: 'inherit' }}
              gap="6"
              px="22px"
              py="18px"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
            >
              <StatLabel color="brandText" fontSize="medium">
                Circulating supply
              </StatLabel>
              <chakra.div ml={{ base: 'auto', md: 'initial' }}>
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    12B IQ
                  </chakra.span>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
          <Stat>
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align={{ base: 'center', md: 'inherit' }}
              gap="6"
              px="22px"
              py="18px"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
            >
              <StatLabel color="brandText" fontSize="medium">
                {' '}
                24hours volume
              </StatLabel>
              <chakra.div ml={{ base: 'auto', md: 'initial' }}>
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    $1.58M
                  </chakra.span>
                  <StatHelpText position="relative">
                    <StatArrow type="decrease" />
                    <chakra.span
                      color="red"
                      fontSize={{ base: 'xs', md: 'inherit' }}
                      mr={{ base: 1, md: 0 }}
                    >
                      15.50%
                    </chakra.span>
                  </StatHelpText>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ lg: '4' }}>
          <GridItem colSpan={[2]}>Graph</GridItem>
          <Flex
            direction={{ base: 'row', lg: 'column' }}
            gap="10"
            py="12"
            px={{ base: 4, md: 14, lg: 0 }}
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            align="center"
            justify="space-evenly"
          >
            <Stack align="center" spacing="4">
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                All-time high
              </Text>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                $0.072{' '}
                <chakra.sup
                  fontSize={{ base: 'xx-small', md: 'md' }}
                  color="red.500"
                >
                  -93.61%
                </chakra.sup>
              </Text>
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                16 Jul 2018 <Dot /> 08:35
              </Text>
            </Stack>
            <chakra.div h="full" w="fit-content">
              <Divider
                w="30"
                borderColor="divider"
                display={{ base: 'none', lg: 'inherit' }}
              />
              <Divider
                borderColor="divider"
                orientation="vertical"
                display={{ lg: 'none' }}
              />
            </chakra.div>
            <Stack align="center" spacing="4">
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                All-time low
              </Text>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                $0.00063
                <chakra.sup
                  fontSize={{ base: 'xx-small', md: 'md' }}
                  color="red.500"
                >
                  +634.21%
                </chakra.sup>
              </Text>
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                16 Jul 2018 <Dot /> 08:35
              </Text>
            </Stack>
          </Flex>
        </SimpleGrid>
      </Stack>
    </DashboardLayout>
  )
}

export default Home
