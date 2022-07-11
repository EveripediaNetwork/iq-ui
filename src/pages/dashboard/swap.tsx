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
  Icon,
} from '@chakra-ui/react'
import { PROVIDERS } from '@/data/ProviderData'

const Swap: NextPage = () => {
  return (
    <DashboardLayout>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        divider={
          <StackDivider
            h={{ base: 4, lg: '90vh' }}
            borderColor="whiteAlpha.200"
          />
        }
      >
        <VStack pt={8} align="left" gap="5" pr={{ base: 0, lg: 14 }}>
          <Heading fontSize={{ md: 'xl', lg: '2xl' }}>SWAP</Heading>
          <Text fontSize="sm" color="dimmedText">
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
              <Box w={{ base: '132', md: '176' }} textAlign="center">
                <Box
                  h={{ base: '92px', md: '122px' }}
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                  border="solid 1px "
                  borderColor="whiteAlpha.200"
                  rounded="lg"
                >
                  <Icon as={provider.icon} boxSize="12" />
                </Box>
                <Text
                  fontSize={{ base: 'sm', lg: 'lg' }}
                  mt={2}
                  fontWeight="bold"
                >
                  {provider.name}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
        <Box
          color="dimmedText"
          textAlign={{ base: 'center', lg: 'left' }}
          p={{ base: 4, lg: 12 }}
          flex="1"
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
