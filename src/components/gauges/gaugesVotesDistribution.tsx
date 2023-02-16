import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, useBreakpointValue } from '@chakra-ui/react'
import { PieChart, Pie, Cell, PieProps } from 'recharts'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import { boxSizeBreakpoint } from '@/data/BreakpointData'

// TODO: fill this automatically
const COLORS = ['#FF5CAA', '#00C49F', '#FFBB28', '#FF8042']

type ChartDataType = {
  name: string
  value: number
}

type PieActiveShape = PieProps['activeShape']

const RADIAN = Math.PI / 180
const renderCustomizedLabel: PieActiveShape = props => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload, value } = props

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      style={{ fontSize: '12px' }}
      x={x + 25}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {payload.name} | {`${value.toFixed(0)}`}
    </text>
  )
}

const GaugesVotesDistribution = () => {
  const [chartData, setChartdata] = useState<ChartDataType[]>([])
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const boxSize = useBreakpointValue(boxSizeBreakpoint)
  const spacing = useBreakpointValue({
    base: { cx: 150, cy: 200 },
    md: { cx: 300, cy: 210 },
    lg: { cx: 240, cy: 210 },
    '2xl': { cx: 210, cy: 210 },
  })

  const { getRelativeWeight } = useGaugeCtrl()

  const fillChartData = async () => {
    // eslint-disable-next-line no-plusplus
    // for (let i = 0; i < gauges.length; i++) {
    //   const gauge = gauges[i]
    //   console.log(gauge)
    //   // eslint-disable-next-line no-await-in-loop
    //   const gaugeRelativeWeight = await getRelativeWeight(gauge.gaugeAddress)
    //   if (gaugeRelativeWeight)
    //     setChartdata(prev => [
    //       ...prev,
    //       { name: gauge.name, value: gaugeRelativeWeight },
    //     ])
    // }
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
    <Flex direction="column" w={{ base: '100%' }}>
      <PieChart width={boxSize?.width} height={boxSize?.height}>
        <Pie
          data={chartData}
          cx={spacing?.cx}
          cy={spacing?.cy}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData
            ? chartData.map((_: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))
            : null}
        </Pie>
      </PieChart>
      <Flex ml={41} direction="column" justifyContent="center">
        {chartData
          ? chartData.map((element: ChartDataType, index: number) => (
              <Flex key={index}>
                <Box
                  width="20px"
                  height="20px"
                  sx={{
                    borderRadius: 10,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <Text ml="15px">{element.name}</Text>
              </Flex>
            ))
          : null}
      </Flex>
    </Flex>
  )
}

export default GaugesVotesDistribution
