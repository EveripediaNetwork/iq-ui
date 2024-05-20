import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Flex,
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
import config from '@/config'
import Chart from '@/components/elements/PieChart/Chart'
import { PIE_CHART_COLORS } from '@/data/treasury-data'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useGetIqPriceQuery } from '@/services/iqPrice'
import {
    SortAndSumTokensValue,
    getTreasuryDetails,
} from '@/utils/treasury-utils'
import {
    ChartDataType,
    OnPieEnter,
    ChartConstantNonTreasury,
  } from '@/types/chartType'
import {
    CUSTOM_GRAPH_PERIODS,
    GraphPeriod,
    GRAPH_PERIODS,
    StakeGraphPeriod,
} from '@/data/dashboard-data'
import {
    fetchTokenData,
    fetchPrices,
    getDateRange,
    renderPercentChange,
    sanitizePrices,
} from '@/utils/dashboard-utils'
import shortenAccount from '@/utils/shortenAccount'
import { Dict } from '@chakra-ui/utils'
import { useErc20 } from '@/hooks/useErc20'
import Link from '@/components/elements/LinkElements/Link'
import GraphPeriodButton from '@/components/dashboard/GraphPeriodButton'
import GraphComponent from '@/components/dashboard/GraphComponent'
import TokenSupplyData from '@/components/dashboard/TokenSupplyData'
import { getNumberOfHiIQHolders } from '@/utils/LockOverviewUtils'

import { useGetStakeValueQuery } from '@/services/stake'
import { useGetTreasuryValueQuery } from '@/services/treasury'



export const DashboardGraphData = () => {
    
    const [treasuryValue, setTreasuryValue] = useState<number>()
    const [prices, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
    const [marketData, setMarketData] = useState<Dict | null>(null)
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
    const isFetchedData = useRef(false)
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
    

    


    const spacing = useBreakpointValue({
        base: { cx: 85, cy: 120 },
        md: { cx: 160, cy: 170 },
        lg: { cx: 95, cy: 120 },
        '2xl': { cx: 110, cy: 140 },
    })

    const radius = useBreakpointValue({
        base: { cx: 40, cy: 90 },
        md: { cx: 70, cy: 140 },
        lg: { cx: 45, cy: 95 },
        '2xl': { cx: 60, cy: 110 },
    })

    const boxSize = useBreakpointValue({
        base: { cx: 200, cy: 250 },
        md: { cx: 370, cy: 370 },
        lg: { cx: 200, cy: 260 },
        '2xl': { cx: 260, cy: 330 },
    })

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


    const getCurrentTreasuryValue = useCallback(async () => {
        const treasuryTokens = await getTreasuryDetails()
        const updatedTreasuryTokens = [
            ...treasuryTokens,
            {
                id: 'HiIQ',
                token: userTotalIQLocked,
                raw_dollar: userTotalIQLocked * rate,
                contractAddress: config.treasuryHiIQAddress,
            },
        ]

        const { totalAccountValue } = await SortAndSumTokensValue(
            updatedTreasuryTokens,
        )
        return totalAccountValue
    }, [rate, userTotalIQLocked])

    

    useEffect(() => {
        const fetchTreasuryValue = async () => {
          if (!isTokenFetched.current) {
            isTokenFetched.current = true
            const treasuryValue = await getCurrentTreasuryValue()
            setTreasuryValue(treasuryValue)
          }
        }
      
        fetchTreasuryValue()
    }, [getCurrentTreasuryValue])

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

    // Fetches total value of HiIQ holders
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
                    graphData={treasuryGraphData}
                    // graphCurrentValue={getCurrentHolderValue(treasuryGraphData)}
                    graphCurrentValue={treasuryValue}
                    graphTitle="BrainDAO Treasury"
                    getRootProps={getTokenRootProps}
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