'use client'

import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next'
import { Flex, Heading, Stack, Text, useRadioGroup } from '@chakra-ui/react'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Dict } from '@chakra-ui/utils'
import { GraphPeriod } from '@/data/dashboard-data'
import {
  fetchPriceChange,
  fetchPrices,
  sanitizePrices,
} from '@/utils/dashboard-utils'
import { useErc20 } from '@/hooks/useErc20'
import { useLockOverview } from '@/hooks/useLockOverview'
import Link from '@/components/elements/LinkElements/Link'
import TokenData from '@/components/dashboard/TokenData'
import TokenPriceData from '@/components/dashboard/TokenPriceData'

const Home: NextPage = () => {
  const { value } = useRadioGroup({
    defaultValue: GraphPeriod.DAY,
  })

  const [prices, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
  const [marketData, setMarketData] = useState<Dict | null>(null)
  const priceChange = {
    [GraphPeriod.DAY]: marketData?.price_change_percentage_24h,
    [GraphPeriod.WEEK]: marketData?.price_change_percentage_7d,
    [GraphPeriod.MONTH]: marketData?.price_change_percentage_30d,
    [GraphPeriod.YEAR]: marketData?.price_change_percentage_1y,
  }
  const percentChange = priceChange?.[value as GraphPeriod]
  const graphData = prices?.[value]
  const isFetchedData = useRef(false)
  const { tvl } = useErc20()
  const { totalHiiqSupply } = useLockOverview()

  useEffect(() => {
    if (!isFetchedData.current) {
      isFetchedData.current = true
      const res = fetchPrices()
      const res2 = fetchPriceChange()
      Promise.resolve(res).then(([day, week, month, year]) => {
        setPrices({
          [GraphPeriod.DAY]: sanitizePrices(day.prices),
          [GraphPeriod.WEEK]: sanitizePrices(week.prices),
          [GraphPeriod.MONTH]: sanitizePrices(month.prices),
          [GraphPeriod.YEAR]: sanitizePrices(year.prices),
        })
      })

      Promise.resolve(res2).then(({ market_data: data }) => {
        setMarketData(data)
      })
    }
  }, [])

  const renderPercentChange = (percent: string) => {
    if (!percent) return null

    const isPositive = percent.toString()[0] !== '-'

    return [
      `${''}${
        percent[0] !== '-'
          ? parseInt(percent).toFixed(2).toString()
          : parseInt(percent).toFixed(2).toString().slice(1)
      }`,

      isPositive,
    ]
  }

  const renderIQPercentChange = () => {
    return renderPercentChange(percentChange)?.[0]
  }

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
      <TokenPriceData
        graphData={graphData}
        renderIQPercentChange={renderIQPercentChange}
        tvl={tvl}
        totalHiiqSupply={totalHiiqSupply}
      />
    </Stack>
  )
}

export default Home