'use client'

import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next'
import {
  Flex,
  Heading,
  Stack,
  Text,
  chakra,
  GridItem,
  useRadioGroup,
  Skeleton,
  Spinner,
  Icon,
  Box,
  Grid,
} from '@chakra-ui/react'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { BraindaoLogo } from '@/components/braindao-logo'
import { Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Dict } from '@chakra-ui/utils'
import { GraphPeriod, GRAPH_PERIODS } from '@/data/dashboard-data'
import {
  fetchPriceChange,
  fetchPrices,
  sanitizePrices,
} from '@/utils/dashboard-utils'
import { useErc20 } from '@/hooks/useErc20'
import { useLockOverview } from '@/hooks/useLockOverview'
import Link from '@/components/elements/LinkElements/Link'
import GraphPeriodButton from '@/components/dashboard/GraphPeriodButton'
import TokenData from '@/components/dashboard/TokenData'
import TokenSupplyData from '@/components/dashboard/TokenSupplyData'
import CustomTooltip from '@/components/dashboard/CustomTooltip'
import PriceDetails from '@/components/dashboard/PriceDetails'
import StakeGraph from '@/components/dashboard/StakeGraph'
import GraphLine from '@/components/dashboard/GraphLine'

const Home: NextPage = () => {
  const { value, getRadioProps, getRootProps } = useRadioGroup({
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
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={4}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Box
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            py={{ base: '13px', md: '22px', lg: '6' }}
            px={{ base: '11px', md: '18px', lg: 5 }}
            minH={{ base: 'auto', lg: '380px' }}
          >
            <Flex align="center">
              <Icon as={BraindaoLogo} boxSize={7} />
              <Text
                fontSize={{ base: '14px', md: '21px', lg: '24px' }}
                fontWeight="600"
                ml="2"
              >
                IQ price
              </Text>
            </Flex>
            <Flex mt="6px">
              {graphData !== undefined ? (
                <chakra.div>
                  <Text
                    fontSize={{ base: '18px', md: '27px', lg: '30px' }}
                    fontWeight={{ base: 700, md: '600' }}
                  >
                    ${graphData?.[graphData.length - 1].amt.toFixed(4)}
                  </Text>
                  <chakra.span
                    fontSize={{ base: '8px', md: '10px', lg: '12px' }}
                    fontWeight="600"
                    color={
                      renderIQPercentChange()?.toString().charAt(0) === '-'
                        ? 'red.500'
                        : 'green'
                    }
                  >
                    {renderIQPercentChange()}%
                  </chakra.span>
                </chakra.div>
              ) : (
                <Skeleton
                  h={{ xl: '6', base: '4' }}
                  w={{ xl: '32', base: '20' }}
                  borderRadius="full"
                />
              )}
              <PriceDetails graphData={graphData} position="HIGHEST" />
            </Flex>
            <Flex
              mt="27px"
              sx={{
                '.recharts-surface, .recharts-wrapper': {
                  w: 'full',
                },
                '.recharts-tooltip-cursor, .recharts-area-curve': {
                  color: 'brandText',
                  stroke: 'currentColor',
                },
                '.gradientStart': {
                  color: 'brandText',
                  _dark: {
                    color: 'rgba(255, 26, 136, 0.2)',
                  },
                },
                '.gradientStop': {
                  color: 'white',
                  _dark: {
                    color: 'transparent',
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height={120}>
                {graphData !== undefined ? (
                  <AreaChart data={graphData}>
                    <Tooltip content={<CustomTooltip />} />
                    <GraphLine />
                    <Area
                      className="area"
                      activeDot={{ r: 4 }}
                      type="monotone"
                      dataKey="amt"
                      stroke="#FF1A88"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                ) : (
                  <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Spinner
                      thickness="4px"
                      speed="0.4s"
                      color="graphSpinnerColor"
                      emptyColor="graphSpinnerEmptyColor"
                      size={{ xl: 'xl', base: 'md' }}
                    />
                    <Text mt="5" color="tooltipColor">
                      Fetching chart data
                    </Text>
                  </Flex>
                )}
              </ResponsiveContainer>
            </Flex>
            <Flex>
              <PriceDetails graphData={graphData} position="LOWEST" />
            </Flex>
            <Flex
              mt={{ md: '6px' }}
              gap={{ base: '6', md: '10', lg: '12' }}
              {...getRootProps()}
            >
              {GRAPH_PERIODS.map((btn) => {
                return (
                  <GraphPeriodButton
                    key={btn.period}
                    label={btn.label}
                    {...getRadioProps({ value: btn.period })}
                  />
                )
              })}
            </Flex>
          </Box>
          <Box my={6}>
            <StakeGraph />
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <TokenSupplyData tvl={tvl} totalHiiqSupply={totalHiiqSupply} />
        </GridItem>
      </Grid>
    </Stack>
  )
}

export default Home
