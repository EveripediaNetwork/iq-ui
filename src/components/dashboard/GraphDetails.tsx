'use client'
import { useCallback, useEffect, useState, useRef } from 'react'
import {
  Flex,
  Text,
  GridItem,
  useRadioGroup,
  Box,
  Grid,
  useColorMode,
  Square,
  HStack,
} from '@chakra-ui/react'
import config from '@/config'
import Chart from '@/components/elements/PieChart/Chart'
import { PIE_CHART_COLORS } from '@/data/treasury-data'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useGetIqPriceQuery } from '@/services/iqPrice'
import {
  CUSTOM_GRAPH_PERIODS,
  GraphPeriod,
  GRAPH_PERIODS,
  StakeGraphPeriod,
} from '@/data/dashboard-data'
import { getDateRange, renderPercentChange } from '@/utils/dashboard-utils'
import {
  ChartDataType,
  OnPieEnter,
  ChartConstantNonTreasury,
} from '@/types/chartType'
import shortenAccount from '@/utils/shortenAccount'
import { useErc20 } from '@/hooks/useErc20'
import Link from '@/components/elements/LinkElements/Link'
import GraphPeriodButton from '@/components/dashboard/GraphPeriodButton'
import GraphComponent from '@/components/dashboard/GraphComponent'
import TokenSupplyData from '@/components/dashboard/TokenSupplyData'
import { getNumberOfHiIQHolders } from '@/utils/LockOverviewUtils'

import { useGetStakeValueQuery } from '@/services/stake'
import { useGetTreasuryValueQuery } from '@/services/treasury/graphql'
import useBoxSizes from '@/utils/graph-utils'
import { getCurrentTreasuryValue } from '@/utils/getTreasuryValue'
import { fetchMarketData } from '@/utils/fetch-market-data'

export const DashboardGraphData = () => {
  const { prices, marketData } = fetchMarketData()
  const [treasuryValue, setTreasuryValue] = useState<number>()
  const [holders, setHolders] = useState<ChartDataType[]>([])
  const [colorData, setColorData] = useState<ChartConstantNonTreasury>({})
  const [activeIndex, setActiveIndex] = useState(0)

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: GraphPeriod.MONTH,
  })

  const {
    value: stakeValue,
    getRadioProps: getStakeRadioProps,
    getRootProps: getStakeRootProps,
  } = useRadioGroup({
    defaultValue: StakeGraphPeriod['30DAYS'],
  })

  const { startDate, endDate } = getDateRange(stakeValue as string)

  const { data: treasuryData } = useGetTreasuryValueQuery({
    startDate,
    endDate,
  })

  const { data: stakeData } = useGetStakeValueQuery({
    startDate,
    endDate,
  })

  const treasuryGraphData = treasuryData?.map((dt) => ({
    amt: parseFloat(dt.totalValue),
    name: new Date(dt.created).toISOString().slice(0, 10),
  }))

  const { userTotalIQLocked, totalHiiqSupply } = useLockOverview(
    config.treasuryHiIQAddress,
  )

  const stakeGraphData = stakeData?.map((dt) => ({
    amt: parseFloat(dt.amount),
    name: new Date(dt.created).toISOString().slice(0, 10),
  }))

  const { data: iqData } = useGetIqPriceQuery('IQ')
  const rate = iqData?.response?.data?.[0]?.quote?.USD?.price || 0.0

  const priceChange = {
    [GraphPeriod.DAY]: marketData?.percent_change_24h,
    [GraphPeriod.WEEK]: marketData?.percent_change_7d,
    [GraphPeriod.MONTH]: marketData?.percent_change_30d,
    [GraphPeriod.YEAR]: marketData?.percent_change_1y,
  }
  const percentChange = priceChange?.[value as GraphPeriod]
  const graphData = prices?.[value]
  const { tvl } = useErc20()

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  const { getRadioProps: getTokenRadioProps, getRootProps: getTokenRootProps } =
    useRadioGroup({
      defaultValue: StakeGraphPeriod['30DAYS'],
    })

  const { boxSize, spacing, radius } = useBoxSizes()

  const { colorMode } = useColorMode()
  const isTokenFetched = useRef(false)

  const renderIQPercentChange = () => {
    return renderPercentChange(percentChange)?.[0]
  }

  if (treasuryValue && treasuryGraphData) {
    treasuryGraphData[treasuryGraphData.length - 1] = {
      amt: treasuryValue,
      name: treasuryGraphData[treasuryGraphData.length - 1]?.name,
    }
  }

  useEffect(() => {
    const fetchTreasuryValue = async () => {
      if (!isTokenFetched.current) {
        isTokenFetched.current = true
        const treasuryValue = await getCurrentTreasuryValue(
          rate,
          userTotalIQLocked,
        )
        setTreasuryValue(treasuryValue)
      }
    }
    fetchTreasuryValue()
  }, [rate, userTotalIQLocked])

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
        HOLDERS_PIE_CHART_COLORS_MAP[tok.address] = PIE_CHART_COLORS[index]
      })
      setColorData(HOLDERS_PIE_CHART_COLORS_MAP)
      setHolders(result)
    }
    getHiIQHolders()
  }, [])

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={4}>
      <GridItem colSpan={{ base: 12, lg: 8 }}>
        <Box mb={6}>
          <GraphComponent
            getRootProps={getStakeRootProps}
            areaGraphData={graphData}
            renderIQPercentChange={renderIQPercentChange()}
            iqPrice={marketData?.price}
            areaGraph={true}
            graphCurrentValue={tvl}
            graphTitle="IQ Price"
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
            graphTitle="IQ Staked Over Time"
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
              isTreasuryPage={false}
            />
            <Box mt={{ lg: '2', '2xl': '-11' }}>
              <Flex w="full" direction="column" gap={{ base: 2, md: 4 }}>
                {holders.map((item) => (
                  <HStack w="full" key={item.name}>
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
            graphTitle="BrainDAO Treasury"
            graphData={treasuryGraphData}
            getRootProps={getTokenRootProps}
            graphCurrentValue={treasuryValue}
            areaGraph={false}
            height={200}
            isTreasuryPage
          >
            {CUSTOM_GRAPH_PERIODS.map((btn) => {
              return (
                <GraphPeriodButton
                  key={btn.period}
                  label={btn.label}
                  isDisabled={
                    btn.period === StakeGraphPeriod['1Y'] ||
                    btn.period === StakeGraphPeriod.ALL
                  }
                  {...getTokenRadioProps({ value: btn.period })}
                />
              )
            })}
          </GraphComponent>
        </Box>
      </GridItem>
    </Grid>
  )
}
