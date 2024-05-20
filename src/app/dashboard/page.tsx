'use client'
import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'

import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Dict } from '@chakra-ui/utils'
import { GraphPeriod } from '@/data/dashboard-data'
import {
  fetchTokenData,
  fetchPrices,
  sanitizePrices,
} from '@/utils/dashboard-utils'
import Link from '@/components/elements/LinkElements/Link'
import TokenData from '@/components/dashboard/TokenData'

import { DashboardGraphData } from '@/components/dashboard/GraphDetails'

const Home: NextPage = () => {
  const [_, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
  const [marketData, setMarketData] = useState<Dict | null>(null)

  const isFetchedData = useRef(false)

  useEffect(() => {
    if (!isFetchedData.current) {
      isFetchedData.current = true
      const prices = fetchPrices()
      const IQTokenData = fetchTokenData('IQ')

      Promise.resolve(prices).then(([day, week, month, year]) => {
        setPrices({
          [GraphPeriod.DAY]: sanitizePrices(day.prices),
          [GraphPeriod.WEEK]: sanitizePrices(week.prices),
          [GraphPeriod.MONTH]: sanitizePrices(month.prices),
          [GraphPeriod.YEAR]: sanitizePrices(year.prices),
        })
      })

      Promise.resolve(IQTokenData).then((data) => {
        setMarketData(data)
      })
    }
  }, [])

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
            Welcome to the IQ Dashboard
          </Heading>
          <Text
            textAlign={{ base: 'center', lg: 'left' }}
            fontSize={{ base: 'sm', lg: 'md' }}
            fontWeight="medium"
          >
            The{' '}
            <Link href="https://iq.wiki/wiki/iq" isExternal>
              IQ token
            </Link>{' '}
            is a multichain token that powers the BrainDAO ecosystem of dapps.
            You can stake your tokens, bridge them across blockchains, vote on
            governance proposals, and more all through the IQ Dashboard.
          </Text>
        </Stack>

        <BraindaoLogo3
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
