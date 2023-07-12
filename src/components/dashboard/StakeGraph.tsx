import {
  Flex,
  GridItem,
  Skeleton,
  Spinner,
  Text,
  chakra,
  Box,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { BraindaoLogo } from '../braindao-logo'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import CustomTooltip from './CustomTooltip'
import * as Humanize from 'humanize-plus'
import GraphLine from './GraphLine'
import GraphPeriodWrapper from './GraphPeriodWrapper'

const StakeGraph = ({
  graphTitle,
  getRootProps,
  graphData,
  graphCurrentValue,
  children,
}: {
  graphTitle: string
  getRootProps: any
  graphData: { name: string; amt: number }[] | undefined
  graphCurrentValue: number
  children: ReactNode
}) => {
  return (
    <GridItem
      colSpan={[2]}
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      py={{ base: '13px', md: '22px', lg: '6' }}
      px={{ base: '11px', md: '18px', lg: 5 }}
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Flex direction="column">
          <Flex align="center">
            <Icon as={BraindaoLogo} boxSize={7} />
            <Text
              fontSize={{ base: '14px', md: '21px', lg: '24px' }}
              fontWeight="600"
              ml="2"
            >
              {graphTitle}
            </Text>
          </Flex>
          <Flex mt="6px">
            {graphCurrentValue ? (
              <chakra.div>
                <Text
                  fontSize={{ base: '18px', md: '27px', lg: '30px' }}
                  fontWeight={{ base: 700, md: '600' }}
                >
                  {`${Humanize.formatNumber(graphCurrentValue, 2)} IQ`}
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
        </Flex>
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
        <ResponsiveContainer width="100%" height={150}>
          {graphData !== undefined ? (
            <AreaChart data={graphData}>
              <YAxis
                dataKey="amt"
                stroke="currentColor"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) =>
                  Humanize.compactInteger(value, 1)
                }
                interval={0}
                tick={{ fontSize: 12 }}
                type="number"
                minTickGap={5}
              />
              <Tooltip content={<CustomTooltip isPrice={false} />} />
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
      </Flex>
      <Box mt={12}>
        <GraphPeriodWrapper getRootProps={getRootProps}>
          {children}
        </GraphPeriodWrapper>
      </Box>
    </GridItem>
  )
}

export default StakeGraph
