import { Flex, Skeleton, Spinner, Text, chakra, Box } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { BraindaoLogo } from '../braindao-logo'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import CustomTooltip from './CustomTooltip'
import * as Humanize from 'humanize-plus'
import GraphLine from './GraphLine'
import GraphPeriodWrapper from './GraphPeriodWrapper'
import PriceDetails from './PriceDetails'
import { Dict } from '@chakra-ui/utils'

const GraphComponent = ({
  graphTitle,
  getRootProps,
  areaGraphData,
  graphData,
  graphCurrentValue,
  height = 200,
  children,
  isTreasuryPage = false,
  areaGraph,
  renderIQPercentChange,
}: {
  graphTitle: string
  isTreasuryPage?: boolean
  getRootProps: any
  areaGraphData?: Dict<number>[] | undefined
  graphData?: { name: string; amt: number }[] | undefined
  graphCurrentValue: number | undefined
  height?: number
  children: ReactNode
  areaGraph: boolean
  renderIQPercentChange?: string | boolean | undefined
}) => {
  return (
    <Box
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      py={{ base: '13px', md: '22px', lg: '6' }}
      px={{ base: '11px', md: '18px', lg: 5 }}
      minH={{ base: 'auto', lg: '380px' }}
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Flex direction="column" w="full">
          <Flex align="center" w="full">
            <Icon as={BraindaoLogo} boxSize={7} />
            <Text
              fontSize={{ base: '14px', md: '21px', lg: '24px' }}
              fontWeight="600"
              ml="2"
            >
              {graphTitle}
            </Text>
          </Flex>
          {areaGraph ? (
            <Flex mt="6px">
              {areaGraphData !== undefined ? (
                <Box display="flex" justifyContent="center">
                  <Text
                    fontSize={{ base: '18px', md: '27px', lg: '30px' }}
                    fontWeight={{ base: 700, md: '600' }}
                  >
                    ${areaGraphData?.[areaGraphData.length - 1].amt.toFixed(4)}
                  </Text>
                  <Text position="relative">
                    <chakra.span
                      fontSize={{ base: '8px', md: '10px', lg: '12px' }}
                      fontWeight="600"
                      color={
                        renderIQPercentChange?.toString().charAt(0) === '-'
                          ? 'red.500'
                          : 'green'
                      }
                    >
                      {renderIQPercentChange?.toString().charAt(0) === '-' ? "-" : "+"}
                      {renderIQPercentChange}%
                    </chakra.span>
                  </Text>
                </Box>
              ) : (
                <Skeleton
                  h={{ xl: '6', base: '4' }}
                  w={{ xl: '32', base: '20' }}
                  borderRadius="full"
                />
              )}
              <PriceDetails graphData={areaGraphData} position="HIGHEST" />
            </Flex>
          ) : (
            <Flex mt="6px">
              {graphCurrentValue ? (
                <chakra.div>
                  <Text
                    fontSize={{ base: '18px', md: '27px', lg: '30px' }}
                    fontWeight={{ base: 700, md: '600' }}
                  >
                    {isTreasuryPage
                      ? `$ ${Humanize.formatNumber(graphCurrentValue, 2)}`
                      : `${Humanize.formatNumber(graphCurrentValue, 2)} IQ`}
                  </Text>
                </chakra.div>
              ) : (
                <Skeleton
                  h={{ xl: '6', base: '4' }}
                  w={{ xl: '32', base: '20' }}
                  borderRadius="full"
                />
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
      <Flex
        mt="27px"
        sx={{
          '.recharts-surface, .recharts-wrapper': {
            w: '100%',
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
        <>
          {areaGraph ? (
            <ResponsiveContainer width="100%" height={height}>
              {areaGraphData !== undefined ? (
                <AreaChart data={areaGraphData}>
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
          ) : (
            <ResponsiveContainer height={height}>
              {graphData !== undefined ? (
                <AreaChart data={graphData}>
                  <YAxis
                    dataKey="amt"
                    stroke="currentColor"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) =>
                      Humanize.compactInteger(value, 2)
                    }
                    tick={{ fontSize: 12 }}
                    type="number"
                    tickCount={7}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        isTreasuryPage={isTreasuryPage}
                        isPrice={false}
                      />
                    }
                  />
                  <defs>
                    <GraphLine />
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
          )}
        </>
      </Flex>
      {areaGraph && (
        <Flex>
          <PriceDetails graphData={areaGraphData} position="LOWEST" />
        </Flex>
      )}
      <Box mt={areaGraph ? 1 : 5} mb="1">
        <GraphPeriodWrapper getRootProps={getRootProps}>
          {children}
        </GraphPeriodWrapper>
      </Box>
    </Box>
  )
}

export default GraphComponent
