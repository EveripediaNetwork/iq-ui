import React from 'react'
import type { NextPage } from 'next'
import { DashboardLayout } from '@/components/dashboard/layout'
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
    <DashboardLayout squeeze>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        divider={
          <StackDivider h={{ base: 4, lg: '95vh' }} borderColor="divider" />
        }
        px={{ base: '6', md: '7', lg: '10' }}
        py={{ base: '5', lg: '0' }}
        pb="16"
      >
        <Box pt={8} pr={{ lg: 14 }}>
          <Heading mb={2} fontSize={{ md: 'xl', lg: '2xl' }}>
            SWAP
          </Heading>
          <VStack align="left" gap="5">
            <Text fontSize="sm" color="dimmedText">
              Get involved in the IQ Ecosystem and swap the IQ token easily
              across different exchange platforms.
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
        >
          <Text fontSize="sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque, et
            condimentum convallis ligula gravida at. Morbi nulla sed vel leo.
            Venenatis massa nisl vitae morbi tincidunt libero. Morbi enim
            placerat in malesuada id nisl ultrices id. Get involved in the IQ
            Ecosystem and swap the IQ token easily across different exchange
            platforms.
          </Text>
          <Text fontSize="sm" mt="8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque, et
            condimentum convallis ligula gravida at. Morbi nulla sed vel leo.
            Venenatis massa nisl vitae morbi tincidunt libero. Morbi enim
            placerat in malesuada id nisl ultrices id. Get involved in the IQ
            Ecosystem and swap the IQ token easily across different exchange
            platforms.
          </Text>
        </Box>
      </Stack>
    </DashboardLayout>
  )
}

export default Swap
