import React, { memo, useState, useEffect, useCallback } from 'react'
import {
  Box,
  Text,
  useBreakpointValue,
  useColorMode,
  CircularProgress,
  VStack,
} from '@chakra-ui/react'
import { PieChart, Pie, Cell, PieProps, Sector } from 'recharts'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import { breakpoints } from '@/data/BreakpointData'
import { VOTE_CHART_COLORS } from '@/data/treasury-data'

type PieActiveShape = PieProps['activeShape']
type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

type ChartDataType = {
  name: string
  value: number
}

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

const GaugesVotesDistribution = () => {
  const [chartData, setChartdata] = useState<ChartDataType[]>([])
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const { colorMode } = useColorMode()
  const boxSize = useBreakpointValue(breakpoints[0].values)
  const radius = useBreakpointValue(breakpoints[1].values)
  const spacing = useBreakpointValue(breakpoints[2].values)
  const { getRelativeWeight } = useGaugeCtrl()
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  const fillChartData = async () => {
    gauges.forEach(async gauge => {
      const gaugeRelativeWeight = await getRelativeWeight(gauge.gaugeAddress)
      if (gaugeRelativeWeight)
        setChartdata(prev => [
          ...prev,
          { name: gauge.name, value: gaugeRelativeWeight },
        ])
    })
  }

  useEffect(() => {
    fillChartData()
  }, [gauges])

  return (
    <Box
      display="flex"
      mt={{ lg: -2 }}
      justifyContent="center"
      alignItems="center"
    >
      {chartData.length > 0 ? (
        <PieChart width={boxSize?.cx} height={boxSize?.cy}>
          <Pie
            activeIndex={activeIndex}
            data={chartData}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
            cx={spacing?.cx}
            cy={spacing?.cy}
            innerRadius={radius?.cx}
            outerRadius={radius?.cy}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
          >
            {chartData.map((dt, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colorMode === 'light'
                    ? VOTE_CHART_COLORS[dt.name].light
                    : VOTE_CHART_COLORS[dt.name].dark
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
  )
}
export default memo(GaugesVotesDistribution)
