'use client'

import React from 'react'
import type { NextPage } from 'next'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { IQLogo3 } from '@/components/iq-logo-3'
import Link from '@/components/elements/LinkElements/Link'
import TokenData from '@/components/dashboard/TokenData'
import { DashboardGraphData } from '@/components/dashboard/GraphDetails'
import { fetchMarketData } from '@/utils/fetch-market-data'
import { useTranslations } from 'next-intl'

const Home: NextPage = () => {
  const { marketData } = fetchMarketData()
  const t = useTranslations('dashboard')

  return (
    <Stack
      h="full"
      mb="4.375em"
      py={{ base: '5', lg: '6' }}
      spacing={{ base: 7, md: 5, lg: 6 }}
    >
      <Flex
        gap={{ lg: '15' }}
        p={{ base: 4, md: 7 }}
        bg="cardBg"
        border="solid 1px"
        borderColor="divider"
        h="fit-content"
        rounded="lg"
        align={{ base: 'start', lg: 'center' }}
        direction={{ base: 'column', lg: 'row' }}
      >
        <Stack order={{ base: 1, lg: 0 }}>
          <Heading
            textAlign={{ base: 'center', lg: 'left' }}
            fontSize={{ base: 'xl', lg: '2xl' }}
          >
            {t('welcomeTitle')}
          </Heading>
          <Text
            textAlign={{ base: 'center', lg: 'left' }}
            fontSize={{ base: 'sm', lg: 'md' }}
            fontWeight="medium"
          >
            {t.rich('welcomeDescription', {
              iqTokenLink: (chunks) => (
                <Link href="https://iq.wiki/wiki/iq" isExternal>
                  {chunks}
                </Link>
              ),
            })}
          </Text>
        </Stack>

        <IQLogo3
          mx={{ base: 'auto', lg: 'none' }}
          h={{ base: '72px', lg: '8.125em' }}
          w={{ base: '72px', lg: '154px' }}
        />
      </Flex>
      <TokenData marketData={marketData} />

      <DashboardGraphData />
    </Stack>
  )
}
export default Home
