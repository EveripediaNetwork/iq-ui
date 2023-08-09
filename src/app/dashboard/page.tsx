'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import type { NextPage } from 'next'
import {
  Flex,
  Heading,
  Stack,
  Text,
  GridItem,
  useRadioGroup,
  Box,
  Grid,
  useBreakpointValue,
  useColorMode,
  Square,
  HStack,
} from '@chakra-ui/react'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Dict } from '@chakra-ui/utils'
import {
  CUSTOM_GRAPH_PERIODS,
  GraphPeriod,
  GRAPH_PERIODS,
  StakeGraphPeriod,
} from '@/data/dashboard-data'
import {
  fetchPriceChange,
  fetchPrices,
  getDateRange,
  sanitizePrices,
} from '@/utils/dashboard-utils'
import { useErc20 } from '@/hooks/useErc20'
import { useLockOverview } from '@/hooks/useLockOverview'
import Link from '@/components/elements/LinkElements/Link'
import GraphPeriodButton from '@/components/dashboard/GraphPeriodButton'
import TokenData from '@/components/dashboard/TokenData'
import TokenSupplyData from '@/components/dashboard/TokenSupplyData'
import GraphComponent from '@/components/dashboard/GraphComponent'
import { getNumberOfHiIQHolders } from '@/utils/LockOverviewUtils'
import Chart from '@/components/elements/PieChart/Chart'
import { HOLDERS_PIE_CHART_COLORS } from '@/data/treasury-data'
import { ChartDataType, OnPieEnter } from '@/types/chartType'
import shortenAccount from '@/utils/shortenAccount'
import { useGetStakeValueQuery } from '@/services/stake'

type ColorsMap = {
  [key: string]: { light: string; dark: string }
}

const Home: NextPage = () => {
  const { value, getRadioProps } = useRadioGroup({
    defaultValue: GraphPeriod.DAY,
  })
  const {
    value: stakeValue,
    getRadioProps: getStakeRadioProps,
    getRootProps: getStakeRootProps,
  } = useRadioGroup({
    defaultValue: StakeGraphPeriod['ALL'],
  })
  const {
    //*** */
    //get holder value
    // value: holderValue,
    getRadioProps: getHolderRadioProps,
    getRootProps: getHolderRootProps,
  } = useRadioGroup({
    defaultValue: StakeGraphPeriod['ALL'],
  })
  const { startDate, endDate } = getDateRange(stakeValue as string)
  const { data } = useGetStakeValueQuery({ startDate, endDate })
  const stakeGraphData = data?.map((dt) => ({
    amt: parseFloat(dt.amount),
    name: new Date(dt.created).toISOString().slice(0, 10),
  }))
  const [prices, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
  const [marketData, setMarketData] = useState<Dict | null>(null)
  const priceChange = {
    [GraphPeriod.DAY]: marketData?.percent_change_24h,
    [GraphPeriod.WEEK]: marketData?.percent_change_7d,
    [GraphPeriod.MONTH]: marketData?.percent_change_30d,
    [GraphPeriod.YEAR]: marketData?.percent_change_1y,
  }
  const percentChange = priceChange?.[value as GraphPeriod]
  const graphData = prices?.[value]
  const isFetchedData = useRef(false)
  const { tvl } = useErc20()
  const { totalHiiqSupply } = useLockOverview()
  const [holders, setHolders] = useState<ChartDataType[]>([])
  const [colorData, setColorData] = useState<ColorsMap>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  useEffect(() => {
    const getHiIQHolders = async () => {
      const data = await getNumberOfHiIQHolders()
      const result = data.holdersData.map((tok: any) => ({
        name: tok.address,
        value: tok.share,
        amount: tok.balance,
      }))
      const HOLDERS_PIE_CHART_COLORS_MAP: {
        [key: string]: { light: string; dark: string }
      } = {}
      data.holdersData.forEach((tok: any, index: number) => {
        HOLDERS_PIE_CHART_COLORS_MAP[tok.address] =
          HOLDERS_PIE_CHART_COLORS[index]
      })
      setColorData(HOLDERS_PIE_CHART_COLORS_MAP)
      setHolders(result)
    }
    getHiIQHolders()
  }, [])

  const boxSize = useBreakpointValue({
    base: { cx: 200, cy: 250 },
    md: { cx: 370, cy: 370 },
    lg: { cx: 200, cy: 260 },
    '2xl': { cx: 260, cy: 330 },
  })

  const radius = useBreakpointValue({
    base: { cx: 40, cy: 90 },
    md: { cx: 70, cy: 140 },
    lg: { cx: 45, cy: 95 },
    '2xl': { cx: 60, cy: 110 },
  })
  const spacing = useBreakpointValue({
    base: { cx: 85, cy: 120 },
    md: { cx: 160, cy: 170 },
    lg: { cx: 95, cy: 120 },
    '2xl': { cx: 110, cy: 140 },
  })

  const { colorMode } = useColorMode()

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

      Promise.resolve(res2).then((data) => {
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
          <Box mb={6}>
            <GraphComponent
              getRootProps={getStakeRootProps}
              areaGraphData={graphData}
              renderIQPercentChange={renderIQPercentChange()}
              areaGraph={true}
              graphCurrentValue={tvl}
              graphTitle="IQ price"
              height={120}
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
            </GraphComponent>
          </Box>
          <Box my={6}>
            <GraphComponent
              getRootProps={getStakeRootProps}
              graphData={stakeGraphData}
              areaGraph={false}
              graphCurrentValue={tvl}
              graphTitle="IQ Staked Over time"
              height={200}
            >
              {CUSTOM_GRAPH_PERIODS.map((btn) => {
                return (
                  <GraphPeriodButton
                    key={btn.period}
                    label={btn.label}
                    {...getStakeRadioProps({ value: btn.period })}
                  />
                )
              })}
            </GraphComponent>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <TokenSupplyData
            statOneTitle="Total IQ Locked"
            statTwoTitle="Total HiIQ"
            tvl={tvl}
            totalHiiqSupply={totalHiiqSupply}
          />
          <Flex
            direction="column"
            gap="3"
            py="5"
            mt="6"
            px={{ base: 4, md: 14, lg: 0 }}
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            align="center"
            justify="space-evenly"
            minH="410px"
          >
            <Text
              fontSize={{ base: '19px', md: '23px', lg: '24px' }}
              fontWeight="600"
              ml="2"
            >
              Top HiIQ Holders
            </Text>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              // mr="8px"
              pt={{ lg: '4', '2xl': '0' }}
              pb={{ lg: '16', '2xl': '3' }}
            >
              <Chart
                boxSize={boxSize}
                spacing={spacing}
                radius={radius}
                chartData={holders}
                colorMode={colorMode}
                CHART_COLORS={colorData}
                onPieEnter={onPieEnter}
                activeIndex={activeIndex}
              />

              <Box mt={{ lg: '2', '2xl': '-11' }}>
                <Flex w="full" direction="column" gap={{ base: 2, md: 4 }}>
                  {holders.map((item) => (
                    <HStack w="full">
                      <Square
                        bg={
                          colorMode === 'light'
                            ? colorData[item.name].light
                            : colorData[item.name].dark
                        }
                        size={3}
                      />
                      {item.name !== 'Others' ? (
                        <Link
                          href={`https://etherscan.io/address/${item.name}`}
                          isExternal
                          fontSize={{ base: '14px', lg: '11px' }}
                        >
                          {shortenAccount(item.name)}
                        </Link>
                      ) : (
                        <Text
                          fontSize={{ base: '14px', lg: '11px' }}
                          color="brandText"
                        >
                          {item.name}
                        </Text>
                      )}
                    </HStack>
                  ))}
                </Flex>
              </Box>
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 12 }}>
          <Box mb={6}>
            <GraphComponent
              getRootProps={getHolderRootProps}
              areaGraph={false}
              graphCurrentValue={undefined}
              graphTitle="IQ Token Holders over time"
              height={120}
            >
              {CUSTOM_GRAPH_PERIODS.map((btn) => {
                return (
                  <GraphPeriodButton
                    key={btn.period}
                    label={btn.label}
                    {...getHolderRadioProps({ value: btn.period })}
                  />
                )
              })}
            </GraphComponent>
          </Box>
        </GridItem>
      </Grid>
    </Stack>
  )
}

export default Home
