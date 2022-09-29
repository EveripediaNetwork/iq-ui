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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque, et
          condimentum convallis ligula gravida at. Morbi nulla sed vel leo.
          Venenatis massa nisl vitae morbi tincidunt libero. Morbi enim placerat
          in malesuada id nisl ultrices id. Get involved in the IQ Ecosystem and
          swap the IQ token easily across different exchange platforms.
        </Text>
        <Text fontSize="sm" mt="8" fontWeight="medium" color="fadedText4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque, et
          condimentum convallis ligula gravida at. Morbi nulla sed vel leo.
          Venenatis massa nisl vitae morbi tincidunt libero. Morbi enim placerat
          in malesuada id nisl ultrices id. Get involved in the IQ Ecosystem and
          swap the IQ token easily across different exchange platforms.
        </Text>
      </Box>
    </Stack>
  )
}

export default Swap
