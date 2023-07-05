import {
  Flex,
  GridItem,
  Skeleton,
  Spacer,
  Spinner,
  Text,
  chakra,
  useRadioGroup,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import React from 'react'
import { BraindaoLogo } from '../braindao-logo'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'
import CustomTooltip from './CustomTooltip'
import { GRAPH_PERIODS, GraphPeriod } from '@/data/dashboard-data'
import GraphPeriodButton from './GraphPeriodButton'
import { useErc20 } from '@/hooks/useErc20'
import * as Humanize from 'humanize-plus'

const StakeGraph = () => {
  const { tvl } = useErc20()
  const graphData = [
    {
      amt: 0,
      name: '2023-7-01',
    },
    {
      amt: 50,
      name: '2023-7-02',
    },
    {
      amt: 25,
      name: '2023-7-03',
    },
    {
      amt: 100,
      name: '2023-7-04',
    },
    {
      amt: 75,
      name: '2023-7-05',
    },
  ]
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: GraphPeriod.DAY,
  })
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
        <Spacer />
        <Flex
          gap={{ base: '3', md: '5', lg: '6' }}
          {...getRootProps()}
          align="flex-end"
          mt={{ base: '10px', md: '0' }}
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
        <ResponsiveContainer width="100%" height={200}>
          {graphData !== undefined ? (
            <AreaChart data={graphData}>
              <Tooltip content={<CustomTooltip isPrice={false} />} />
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
    </GridItem>
  )
}

export default StakeGraph
