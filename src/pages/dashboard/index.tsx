import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next'
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
  useRadioGroup,
  UseRadioProps,
  useRadio,
  Box,
  Skeleton,
  Spinner,
  Icon,
} from '@chakra-ui/react'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { BraindaoLogo } from '@/components/braindao-logo'
import { Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Dict } from '@chakra-ui/utils'
import { GraphPeriod, GRAPH_PERIODS } from '@/data/dashboard-data'
import {
  fetchPriceChange,
  fetchPrices,
  numFormatter,
  sanitizePrices,
} from '@/utils/dashboard-utils'
import { useErc20 } from '@/hooks/useErc20'
import * as Humanize from 'humanize-plus'
import { useLockOverview } from '@/hooks/useLockOverview'

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
            The IQ token is a multichain token that powers the BrainDAO
            ecosystem of dapps. IQ is a DeFi token that can be staked for HiIQ
            to earn rewards and NFT raffles. You can stake your tokens, bridge
            them across blockchains, vote on governance proposals, and more all
            through the IQ Dashboard.
          </Text>
        </Stack>
        <BraindaoLogo3 h="8.125em" w="154px" />
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
        <Stat>
          <Flex
            minH={{ xl: '40', md: '25', base: '15' }}
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
              {marketData !== null ? (
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
              ) : (
                <Skeleton
                  height={{ xl: '30px', base: '18px' }}
                  mt={{ md: '5' }}
                  w={{ xl: 'full', base: '24' }}
                  borderRadius="full"
                />
              )}
            </chakra.div>
          </Flex>
        </Stat>
        <Stat>
          <Flex
            minH={{ xl: '40', md: '25', base: '15' }}
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
              {marketData !== null ? (
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    {numFormatter(marketData?.circulating_supply)} IQ
                  </chakra.span>
                </StatNumber>
              ) : (
                <Skeleton
                  height={{ xl: '30px', base: '18px' }}
                  mt={{ md: '5', base: '0' }}
                  w={{ xl: 'full', base: '24' }}
                  borderRadius="full"
                />
              )}
            </chakra.div>
          </Flex>
        </Stat>
        <Stat>
          <Flex
            minH={{ xl: '40', md: '25', base: '15' }}
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
              24hr volume
            </StatLabel>
            <chakra.div ml={{ base: 'auto', md: 'initial' }}>
              {marketData !== null ? (
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    ${numFormatter(marketData?.total_volume.usd)}
                  </chakra.span>
                </StatNumber>
              ) : (
                <Skeleton
                  height={{ xl: '30px', base: '18px' }}
                  mt={{ md: '5', base: '0' }}
                  w={{ xl: 'full', base: '24' }}
                  borderRadius="full"
                />
              )}
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
            <Icon as={BraindaoLogo} boxSize={7} />
            <Text
              fontSize={{ base: '14px', md: '21px', lg: '24px' }}
              fontWeight="600"
              ml="2"
            >
              IQ.Wiki price
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
            <chakra.span
              fontSize={{ base: '12px', md: '14px', lg: '16px' }}
              fontWeight="500"
              color="fadedText2"
              ml="auto"
            >
              {graphData !== undefined ? (
                `$${graphData?.[graphData.length - 1].amt.toFixed(4)}`
              ) : (
                <Skeleton
                  h="3.5"
                  w={{ xl: '24', base: '15' }}
                  borderRadius="full"
                />
              )}
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
              {graphData !== undefined ? (
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
            <chakra.span
              fontSize={{ base: '12px', md: '14px', lg: '16px' }}
              fontWeight="500"
              color="fadedText2"
              ml="auto"
            >
              {graphData !== undefined ? (
                `$${graphData?.[0].amt.toFixed(4)}`
              ) : (
                <Skeleton
                  h="3.5"
                  w={{ xl: '24', base: '15' }}
                  borderRadius="full"
                />
              )}
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
          mt={{ base: '5', xl: '0' }}
          rounded="lg"
          border="solid 1px "
          borderColor="divider"
          align="center"
          justify="space-evenly"
        >
          <Stack align="center" spacing="4">
            <Text
              color="dimmedText"
              fontSize={{ base: 'xs', md: 'inherit' }}
              fontWeight="medium"
            >
              Total IQ Locked
            </Text>
            {tvl !== null ? (
              <>
                <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                  {Humanize.formatNumber(tvl, 2)}&nbsp;
                </Text>
              </>
            ) : (
              <Stack>
                <Skeleton
                  h={{ xl: '6', base: '4' }}
                  w={{ xl: '32', base: '20' }}
                  borderRadius="full"
                />
              </Stack>
            )}
          </Stack>
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
          <Stack align="center" spacing="4">
            <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
              Total HiIQ
            </Text>
            {totalHiiqSupply !== null ? (
              <>
                <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                  {Humanize.formatNumber(totalHiiqSupply, 2)}&nbsp;
                </Text>
              </>
            ) : (
              <Stack>
                <Skeleton
                  h={{ xl: '6', base: '4' }}
                  w={{ xl: '32', base: '20' }}
                  borderRadius="full"
                />
              </Stack>
            )}
          </Stack>
        </Flex>
      </SimpleGrid>
    </Stack>
  )
}

export default Home
