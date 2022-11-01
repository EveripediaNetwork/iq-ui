import {
  PIE_CHART_COLORS,
  TOKENS,
  TOKEN_KEYS,
  TREASURIES,
} from '@/data/treasury-data'
import { TreasuryTokenType } from '@/types/TreasuryTokenType'
import { fetchTokens } from '@/utils/treasury-utils'
import { NextSeo } from 'next-seo'
import {
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Table,
  Td,
  Text,
  Thead,
  Tr,
  Box,
  useBreakpointValue,
  Icon,
  CircularProgress,
  VStack,
  SkeletonText,
  useColorMode,
  TableContainer,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useEffect, useState, useCallback } from 'react'
import { PieChart, Pie, Cell, Sector } from 'recharts'
import type { PieProps } from 'recharts'

import * as Humanize from 'humanize-plus'
import { formatValue } from '@/utils/LockOverviewUtils'

type PieActiveShape = PieProps['activeShape']
type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

const renderActiveShape: PieActiveShape = props => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        fontSize="18"
        textAnchor="middle"
        fill={fill}
        fontWeight="bold"
      >
        {payload.name} {`(${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}

const Treasury: NextPage = () => {
  const [tokenData, setTokenData] = useState<TreasuryTokenType[]>([])
  const [accountValue, setAccountValue] = useState<number>(0)
  const { colorMode } = useColorMode()
  const boxSize = useBreakpointValue({
    base: { width: 429, height: 429 },
    md: { width: 519, height: 519 },
    lg: { width: 500, height: 450 },
    '2xl': { width: 380, height: 400 },
  })
  const radius = useBreakpointValue({
    base: { inner: 80, outer: 130 },
    md: { inner: 110, outer: 180 },
    lg: { inner: 100, outer: 170 },
    '2xl': { inner: 100, outer: 150 },
  })
  const spacing = useBreakpointValue({
    base: { cx: 205, cy: 160 },
    md: { cx: 230, cy: 240 },
    lg: { cx: 250, cy: 210 },
    '2xl': { cx: 210, cy: 210 },
  })

  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  useEffect(() => {
    const getTokens = async () => {
      const { totalAccountValue, response } = await fetchTokens()
      setAccountValue(totalAccountValue)
      setTokenData(response)
    }
    getTokens()
  }, [])

  const pieChartData = tokenData.map(tok => ({
    name: TOKENS[tok.id].name,
    value: (tok.raw_dollar / accountValue) * 100,
    amount: tok.raw_dollar,
  }))

  return (
    <>
      <NextSeo
        title="Treasury Page"
        openGraph={{
          title: 'IQ Treasury',
          description:
            'See all the cryptocurrencies and NFTs held in BrainDAO’s diversified treasury.',
        }}
      />
      <Flex direction="column" gap="6" py={{ base: '5', lg: '6' }}>
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Treasury
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fadedText4"
            fontWeight="medium"
          >
            See all the cryptocurrencies and NFTs held in BrainDAO’s diversified
            treasury.
          </Text>
        </Flex>
      </Flex>
      <Text fontWeight="bold" fontSize="2xl">
        Tokens
      </Text>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        mt="8"
        gap={{ base: 10, '2xl': 18 }}
      >
        <Box overflowX="auto">
          <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
            <Table
              w={{
                lg: tokenData.length > 0 ? 'full' : 600,
                '2xl': 630,
              }}
            >
              <Thead border="none" bg="cardBg">
                {TOKEN_KEYS.map((key, i, arr) => (
                  <Td
                    whiteSpace="nowrap"
                    key={key}
                    fontWeight="medium"
                    textAlign={i === arr.length - 1 ? 'center' : 'initial'}
                  >
                    {key}
                  </Td>
                ))}
              </Thead>
              {tokenData.length > 0
                ? tokenData.map((token, i) => (
                    <Tr key={i} fontWeight="medium">
                      <Td>
                        <Flex align="center" gap="18px">
                          <Icon as={TOKENS[token.id].icon} boxSize={7} />
                          <Text fontSize="sm">{TOKENS[token.id].name}</Text>
                        </Flex>
                      </Td>
                      <Td>{Humanize.formatNumber(token.token, 2)}</Td>
                      <Td textAlign="center">
                        ${formatValue(token.raw_dollar)} (
                        {Humanize.formatNumber(
                          (token.raw_dollar / accountValue) * 100,
                          2,
                        )}
                        %)
                      </Td>
                    </Tr>
                  ))
                : [1, 2, 3, 4, 5, 6].map((_, index) => (
                    <Tr key={index} fontWeight="medium">
                      <Td>
                        <SkeletonText noOfLines={1} />
                      </Td>
                      <Td>
                        <SkeletonText noOfLines={1} />
                      </Td>
                      <Td textAlign="center">
                        <SkeletonText noOfLines={1} />
                      </Td>
                    </Tr>
                  ))}
            </Table>
          </TableContainer>
        </Box>
        <Box
          display="flex"
          mt={{ lg: -8 }}
          justifyContent="center"
          alignItems="center"
        >
          {pieChartData.length > 0 ? (
            <PieChart width={boxSize?.width} height={boxSize?.height}>
              <Pie
                activeIndex={activeIndex}
                data={pieChartData}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
                cx={spacing?.cx}
                cy={spacing?.cy}
                innerRadius={radius?.inner}
                outerRadius={radius?.outer}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
              >
                {pieChartData.map((dt, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      colorMode === 'light'
                        ? PIE_CHART_COLORS[dt.name].light
                        : PIE_CHART_COLORS[dt.name].dark
                    }
                    className="pie-cell"
                  />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <Box
              bg="cardBg"
              rounded="full"
              ml={{ lg: 18, '2xl': 14 }}
              mt={4}
              mb={{ base: 24, md: 12, lg: 0 }}
              width={300}
              height={300}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack>
                <CircularProgress isIndeterminate color="brandText" />
                <Text color="tooltipColor">Fetching chart data</Text>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
      <SimpleGrid
        mt={{ base: '0', lg: '5' }}
        mb={{ base: '24', lg: '10' }}
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={{ md: '21px', lg: '25px' }}
        spacingY="43px"
      >
        {TREASURIES.map((treasury, i) => (
          <Flex
            direction="column"
            key={i}
            width={{ base: '430.32px', md: '341.91px', lg: '375.17px' }}
            maxW="full"
            cursor="pointer"
            onClick={() =>
              treasury.href && window.open(`${treasury.href}`, '_blank')
            }
            display={{
              base: 'block',
            }}
            overflow="hidden"
          >
            <Image
              src={treasury.image}
              loading="lazy"
              width="full"
              height={{ base: '411px', md: '328.23px', lg: '367px' }}
              borderTopRightRadius="8"
              borderTopLeftRadius="8"
              objectFit="cover"
            />
            <Stack
              bg="linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.024) 100%)"
              backdropFilter="blur(87.3043px)"
              px={{ base: '2.5', lg: '3' }}
              pb={{ base: '4', md: '2', lg: '2' }}
              transform="matrix(1, 0, 0, 1, 0, 0)"
              roundedBottom="lg"
              mt="-2"
              borderBottom="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
              borderColor="divider"
            >
              <Text fontWeight="bold" fontSize="2xl">
                {treasury.title}
              </Text>
              <Text fontWeight="medium" fontSize="lg">
                {treasury.body}
              </Text>
            </Stack>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  )
}

export default Treasury
