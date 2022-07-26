import { BraindaoLogo } from '@/components/braindao-logo'
import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'

const SAMPLE_ITEM = {
  label: 'EOS Holders',
  amount: '161,048',
  icon: BraindaoLogo,
} as const

const SAMPLE_ARRAY = Array(3).fill(SAMPLE_ITEM)

const STATS = {
  Holders: SAMPLE_ARRAY,
  'Circulating Supply': SAMPLE_ARRAY,
  HiIQ: SAMPLE_ARRAY,
  Liquidity: SAMPLE_ARRAY,
  Apps: SAMPLE_ARRAY,
  Apps2: SAMPLE_ARRAY,
} as const

const Stats: NextPage = () => {
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="8">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Stats
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Stay on top of everything happening in the IQ world.
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingY="6" spacingX="30">
          {Object.entries(STATS).map(([group, items]) => (
            <Flex direction="column" key={group}>
              <Text color="brandText">{group}</Text>
              <Divider mt="1.5" mb="4" />
              <Stack spacing="6">
                {items.map((item, id) => (
                  <Flex key={id} align="center" gap="4">
                    <item.icon boxSize="6" />
                    <Text fontSize={{ base: 'sm', md: 'md' }}>
                      {item.label}
                    </Text>
                    <Text
                      ml="auto"
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontWeight="semibold"
                    >
                      {item.amount}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    </DashboardLayout>
  )
}

export default Stats
