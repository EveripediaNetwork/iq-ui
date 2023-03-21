import { TOKEN_KEYS, PIE_CHART_COLORS, TOKENS } from '@/data/treasury-data'
import { TreasuryTokenType } from '@/types/TreasuryTokenType'
import { formatValue } from '@/utils/LockOverviewUtils'
import * as Humanize from 'humanize-plus'
import {
  useBreakpointValue,
  TableContainer,
  Table,
  Thead,
  Td,
  Tr,
  Icon,
  SkeletonText,
  CircularProgress,
  Box,
  useColorMode,
  Flex,
  VStack,
  Image,
  Text,
} from '@chakra-ui/react'
import { PieProps, PieChart, Pie, Cell } from 'recharts'
import React from 'react'

export const TreasuryGraphTable = ({
  tokenData,
  accountValue,
  activeIndex,
  renderActiveShape,
  onPieEnter,
}: {
  tokenData: TreasuryTokenType[]
  accountValue: number
  activeIndex: number
  renderActiveShape: PieProps['activeShape']
  onPieEnter: NonNullable<PieProps['onMouseEnter']>
}) => {
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

  const pieChartData = tokenData.map(tok => ({
    name: TOKENS[tok.id].name,
    value: (tok.raw_dollar / accountValue) * 100,
    amount: tok.raw_dollar,
  }))

  const { colorMode } = useColorMode()

  return (
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
                        {TOKENS[token.id].icon ? (
                          <Icon as={TOKENS[token.id].icon} boxSize={7} />
                        ) : (
                          <Image
                            src={TOKENS[token.id].image}
                            width="30%"
                          />
                        )}
                        <Text fontSize="sm">{TOKENS[token.id].name}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      {typeof token.token === 'number'
                        ? Humanize.formatNumber(token.token, 2)
                        : token.token.map(t => (
                            <>
                              <span>{`${formatValue(t.amount)} ${
                                t.symbol
                              }`}</span>
                              <br />
                            </>
                          ))}
                    </Td>
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
        mt={{ lg: -2 }}
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
  )
}
