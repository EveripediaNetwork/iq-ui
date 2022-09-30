import React from 'react'
import type { NextPage } from 'next'
import {
  Stack,
  Box,
  Text,
  StackDivider,
  Heading,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react'
import { PROVIDERS } from '@/data/ProviderData'
import PlatformCard from '@/components/cards/PlatformCard'

const Swap: NextPage = () => {
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      divider={
        <StackDivider h={{ base: 4, lg: '95vh' }} borderColor="divider" />
      }
    >
      <Box pt={{ base: '5', lg: '6' }} pr={{ lg: 14 }}>
        <Heading mb={1} fontSize={{ md: 'xl', lg: '2xl' }}>
          SWAP
        </Heading>
        <VStack align="left" gap="5">
          <Text fontSize="md" color="fadedText4" fontWeight="medium">
            Get involved in the IQ Ecosystem and swap the IQ token easily across
            different exchange platforms.
          </Text>
          <SimpleGrid
            px={{ md: 10, lg: 0 }}
            textAlign="center"
            columns={[3, 3, 3]}
            spacingY="8"
            spacingX={{ base: 4, md: 8 }}
          >
            {PROVIDERS.map(provider => (
              <PlatformCard
                icon={provider.icon}
                name={provider.name}
                key={provider.name}
                route={provider.route}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
      <Box
        color="dimmedText"
        textAlign={{ base: 'center', lg: 'left' }}
        p={{ base: 4, lg: 12 }}
        pr={{ lg: 1 }}
        maxW={{ lg: '23.875em' }}
        py={{ base: '7', lg: '8' }}
        pb={{ base: 20, md: 10, lg: 0 }}
      >
        <Text fontSize="sm" fontWeight="medium" color="fadedText4">
          The easiest place to get IQ on Ethereum is through Binance, the world
          largest cryptocurrency exchange. Binance allows users to withdraw and
          deposit IQ on Ethereum and EOS.
        </Text>
        <Text fontSize="sm" mt="8" fontWeight="medium" color="fadedText4">
          IQ is also available on Upbit, Uniswap, Quickswap, and several other
          leading exchanges.
          <br />
          <br />
          You can find a full list of IQ token pairs below.
        </Text>
      </Box>
    </Stack>
  )
}

export default Swap
