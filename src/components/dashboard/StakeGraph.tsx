import {
  Flex,
  GridItem,
  Skeleton,
  Spinner,
  Text,
  chakra,
  useRadioGroup,
  Box,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import React from 'react'
import { BraindaoLogo } from '../braindao-logo'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import CustomTooltip from './CustomTooltip'
import { useErc20 } from '@/hooks/useErc20'
import * as Humanize from 'humanize-plus'
import { useGetStakeValueQuery } from '@/services/stake'
import { StakeGraphPeriod, STAKE_GRAPH_PERIODS } from '@/data/dashboard-data'
import GraphPeriodButton from './GraphPeriodButton'
import GraphLine from './GraphLine'
import { getDateRange } from '@/utils/dashboard-utils'

const StakeGraph = () => {
  const { tvl } = useErc20()
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: StakeGraphPeriod['90DAYS'],
  })
  const { startDate, endDate } = getDateRange(value as string)

  const { data } = useGetStakeValueQuery({ startDate, endDate })

  const graphData = data?.map((dt) => ({
    amt: parseFloat(dt.amount),
    name: new Date(dt.created).toISOString().slice(0, 10),
  }))

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
              IQ Staked Overtime
            </Text>
          </Flex>
          <Flex mt="6px">
            {tvl ? (
              <chakra.div>
                <Text
                  fontSize={{ base: '18px', md: '27px', lg: '30px' }}
                  fontWeight={{ base: 700, md: '600' }}
                >
                  {`${Humanize.formatNumber(tvl, 2)} IQ`}
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
        <Flex
          mt={{ md: '6px' }}
          gap={{ base: '5', md: '9', lg: '11' }}
          {...getRootProps()}
        >
          {STAKE_GRAPH_PERIODS.map(btn => {
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
    </GridItem>
  )
}

export default StakeGraph
