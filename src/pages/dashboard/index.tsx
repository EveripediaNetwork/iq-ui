import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  chakra,
  GridItem,
  Divider,
  Image,
  useRadioGroup,
  UseRadioProps,
  useRadio,
  Box,
} from '@chakra-ui/react'
import { Dot } from '@/components/icons/dot'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Dict } from '@chakra-ui/utils'
import { GraphPeriod, GRAPH_PERIODS } from '@/data/dashboard-data'
import {
  fetchCoinMarket,
  fetchPriceChange,
  fetchPrices,
  numFormatter,
  sanitizePrices,
} from '@/utils/dashboard-utils'

const CustomTooltip = ({ active, payload }: Dict) => {
  if (active && payload && payload.length) {
    return (
      <p>
        <b>Price:</b> {`$${payload[0].value.toFixed(6)}`}
      </p>
    )
  }

  return null
}

const GraphPeriodButton = (props: { label: string } & UseRadioProps) => {
  const { label, ...radioProps } = props
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps)

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Box {...getCheckboxProps()}>
        <Box
          bg={state.isChecked ? 'brandText' : 'transparent'}
          border="solid 1px"
          borderColor={state.isChecked ? 'transparent' : 'divider'}
          color={state.isChecked ? 'white' : 'fadedText3'}
          _hover={{ color: 'white', bg: 'brandText' }}
          fontWeight="500"
          w={{ base: '42px', md: '47px', lg: '50px' }}
          h={{ base: '37px', md: '41px', lg: '44px' }}
          rounded="full"
          p="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.2s ease"
          {...getLabelProps()}
        >
          {label}
        </Box>
      </Box>
    </chakra.label>
  )
}

const Home: NextPage = () => {
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: GraphPeriod.DAY,
  })

  const [prices, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
  const [marketData, setMarketData] = useState<Dict | null>(null)
  const [coinMarket, setCoinMarket] = useState<Dict | null>(null)
  const priceChange = {
    [GraphPeriod.DAY]: marketData?.price_change_percentage_24h,
    [GraphPeriod.WEEK]: marketData?.price_change_percentage_7d,
    [GraphPeriod.MONTH]: marketData?.price_change_percentage_30d,
    [GraphPeriod.YEAR]: marketData?.price_change_percentage_1y,
  }
  const percentChange = priceChange?.[value as GraphPeriod]
  const graphData = prices?.[value]

  useEffect(() => {
    const res = fetchPrices()
    const res2 = fetchPriceChange()
    const res3 = fetchCoinMarket()
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

    Promise.resolve(res3).then(data => {
      setCoinMarket(data[0])
    })
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
    <DashboardLayout>
      <Stack h="full" mb="4.375em" spacing={{ base: 7, md: 5, lg: 6 }} pb="8">
        <Flex
          gap={{ lg: '15' }}
          px={4}
          py={{ base: 3, md: 7, lg: '2.5' }}
          pr={{ lg: '6.25em' }}
          bg="cardBg"
          border="solid 1px"
          borderColor="divider"
          h="fit-content"
          rounded="lg"
          align={{ base: 'start', lg: 'center' }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Stack pt="5" order={{ base: 1, lg: 0 }}>
            <Heading fontSize={{ base: 'xl', lg: '2xl' }}>
              Welcome to the IQ Dashboard
            </Heading>
            <Text fontSize={{ base: 'sm', lg: 'md' }} fontWeight="medium">
              The IQ token is a multichain token that powers the Everipedia
              ecosystem of dapps and features. IQ token is a DeFi token that can
              be staked for hiIQ to earn rewards + yields. You can bridge your
              token from all chains IQ circulares on, using our bridge UI, and
              lots more.
            </Text>
          </Stack>
          <BraindaoLogo3 h="8.125em" w="154px" />
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
          <Stat>
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align={{ base: 'center', md: 'inherit' }}
              gap="6"
              px="22px"
              py="18px"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
            >
              <StatLabel color="brandText" fontSize="medium">
                Market Cap
              </StatLabel>
              <chakra.div
                ml={{ base: 'auto', md: 'initial' }}
                sx={{
                  '.chakra-stat__help-text': {
                    h: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                    fontWeight="semibold"
                  >
                    ${numFormatter(marketData?.market_cap.usd)}
                  </chakra.span>
                  <StatHelpText position="relative">
                    <StatArrow
                      type={
                        marketData?.market_cap_change_percentage_24h
                          .toString()
                          .charAt(0) === '-'
                          ? 'decrease'
                          : 'increase'
                      }
                    />
                    <chakra.span
                      color={
                        marketData?.market_cap_change_percentage_24h
                          .toString()
                          .charAt(0) === '-'
                          ? 'red.500'
                          : 'green'
                      }
                      fontSize={{ base: 'xs', md: 'inherit' }}
                      mr={{ base: 1, md: 0 }}
                    >
                      {marketData?.market_cap_change_percentage_24h
                        .toFixed(3)
                        .toString()
                        .slice(1)}
                      %
                    </chakra.span>
                  </StatHelpText>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
          <Stat>
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align={{ base: 'center', md: 'inherit' }}
              gap="6"
              px="22px"
              py="18px"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
            >
              <StatLabel color="brandText" fontSize="medium">
                Circulating supply
              </StatLabel>
              <chakra.div ml={{ base: 'auto', md: 'initial' }}>
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    {numFormatter(marketData?.circulating_supply)} IQ
                  </chakra.span>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
          <Stat>
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align={{ base: 'center', md: 'inherit' }}
              gap="6"
              px="22px"
              py="18px"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
            >
              <StatLabel color="brandText" fontSize="medium">
                {' '}
                24hours volume
              </StatLabel>
              <chakra.div ml={{ base: 'auto', md: 'initial' }}>
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    ${numFormatter(marketData?.total_volume.usd)}
                  </chakra.span>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ lg: '4' }}>
          <GridItem
            colSpan={[2]}
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            py={{ base: '13px', md: '22px', lg: '6' }}
            px={{ base: '11px', md: '18px', lg: 5 }}
          >
            <Flex align="center">
              <Image
                src="/everipediaCoin.png"
                boxSize={{ base: '22px', md: '9', lg: 10 }}
              />

              <Text
                fontSize={{ base: '14px', md: '21px', lg: '24px' }}
                fontWeight="600"
                ml="2"
              >
                Everipedia (IQ) price
              </Text>
            </Flex>
            <Flex mt="6px">
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
              <chakra.span
                fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                fontWeight="500"
                color="fadedText2"
                ml="auto"
              >
                ${graphData?.[graphData.length - 1].amt.toFixed(4)}
              </chakra.span>
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
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={graphData}>
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        className="gradientStart"
                        offset="5%"
                        stopColor="currentColor"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="60%"
                        className="gradientStop"
                        stopColor="currentColor"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
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
              </ResponsiveContainer>
            </Flex>
            <Flex>
              <chakra.span
                fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                fontWeight="500"
                color="fadedText2"
                ml="auto"
              >
                ${graphData?.[0].amt.toFixed(4)}
              </chakra.span>
            </Flex>
            <Flex
              mt={{ md: '6px' }}
              gap={{ base: '6', md: '10', lg: '12' }}
              {...getRootProps()}
            >
              {GRAPH_PERIODS.map(btn => {
                return (
                  <GraphPeriodButton
                    key={btn.period}
                    label={btn.label}
                    {...getRadioProps({ value: btn.period })}
                  />
                )
              })}
            </Flex>
          </GridItem>
          <Flex
            direction={{ base: 'row', lg: 'column' }}
            gap="10"
            py="12"
            px={{ base: 4, md: 14, lg: 0 }}
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            align="center"
            justify="space-evenly"
          >
            <Stack align="center" spacing="4">
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }} fontWeight="medium">
                All-time high
              </Text>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                ${coinMarket?.ath.toFixed(4)}&nbsp;
                <chakra.sup
                  fontSize={{ base: 'xx-small', md: 'md' }}
                  color={
                    renderPercentChange(coinMarket?.ath_change_percentage)?.[1]
                      ? 'green'
                      : 'red.500'
                  }
                >
                  {coinMarket?.ath_change_percentage.toFixed(2)}%
                </chakra.sup>
              </Text>
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                {coinMarket?.ath_date &&
                  new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(coinMarket?.ath_date))}
                <Dot />{' '}
                {coinMarket?.ath_date &&
                  new Intl.DateTimeFormat('en-US', {
                    timeStyle: 'short',
                  }).format(new Date(coinMarket?.ath_date))}
              </Text>
            </Stack>
            <chakra.div h="full" w="fit-content">
              <Divider
                w="30"
                borderColor="divider"
                display={{ base: 'none', lg: 'inherit' }}
              />
              <Divider
                borderColor="divider"
                orientation="vertical"
                display={{ lg: 'none' }}
              />
            </chakra.div>
            <Stack align="center" spacing="4">
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                All-time low
              </Text>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                ${coinMarket?.atl.toFixed(6)}&nbsp;
                <chakra.sup
                  fontSize={{ base: 'xx-small', md: 'md' }}
                  color={
                    renderPercentChange(coinMarket?.atl_change_percentage)?.[1]
                      ? 'green'
                      : 'red.500'
                  }
                >
                  {renderPercentChange(coinMarket?.atl_change_percentage)?.[0]}%
                </chakra.sup>
              </Text>
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }} fontWeight="medium">
                {coinMarket?.atl_date &&
                  new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(coinMarket?.atl_date))}
                <Dot />{' '}
                {coinMarket?.atl_date &&
                  new Intl.DateTimeFormat('en-US', {
                    timeStyle: 'short',
                  }).format(new Date(coinMarket?.atl_date))}
              </Text>
            </Stack>
          </Flex>
        </SimpleGrid>
      </Stack>
    </DashboardLayout>
  )
}

export default Home
