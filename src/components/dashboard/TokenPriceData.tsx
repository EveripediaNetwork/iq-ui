import { GRAPH_PERIODS, GraphPeriod } from '@/data/dashboard-data'
import {
  Skeleton,
  Spinner,
  SimpleGrid,
  GridItem,
  Flex,
  chakra,
  Icon,
  Text,
  useRadioGroup,
} from '@chakra-ui/react'
import React from 'react'
import { ResponsiveContainer, AreaChart, Tooltip, Area } from 'recharts'
import { Dict } from '@chakra-ui/utils'
import { BraindaoLogo } from '../braindao-logo'
import GraphPeriodButton from './GraphPeriodButton'
import TokenSupplyData from './TokenSupplyData'
import CustomTooltip from './CustomTooltip'


const TokenPriceData = ({
  graphData,
  renderIQPercentChange,
  tvl,
  totalHiiqSupply,
}: {
  graphData: Dict<number>[] | undefined
  renderIQPercentChange: () => string | boolean | undefined
  tvl: number
  totalHiiqSupply: number
}) => {
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: GraphPeriod.DAY,
  })
  return (
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
            IQ price
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
      <TokenSupplyData tvl={tvl} totalHiiqSupply={totalHiiqSupply} />
    </SimpleGrid>
  )
}

export default TokenPriceData
