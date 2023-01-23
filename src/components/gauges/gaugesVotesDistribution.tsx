import React, { useEffect, useState } from 'react'
import { Flex, Box, Text, Select, useBreakpointValue } from '@chakra-ui/react'
import { PieChart, Pie, Cell, PieProps } from 'recharts'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppSelector } from '@/store/hook'
import { Gauge, Vote } from '@/types/gauge'
import { useAccount } from 'wagmi'

// TODO: fill this automatically
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

type ChartDataType = {
  name: string
  value: number
}

enum WEIGHT {
  ALL_WEIGHTS = 'All Weights',
  MY_WEIGHT = 'My Weights',
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
      {payload.name} | {`${value.toFixed(0)} Weight`}
    </text>
  )
}

const GaugesVotesDistribution = () => {
  const [chartData, setChartdata] = useState<ChartDataType[]>([])
  const { address, isDisconnected } = useAccount()
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const votes: Vote[] = useAppSelector(state => state.gauges.votes)
  const boxSize = useBreakpointValue({
    base: { width: 429, height: 429 },
    md: { width: 519, height: 519 },
    lg: { width: 400, height: 450 },
    '2xl': { width: 380, height: 400 },
  })
  const spacing = useBreakpointValue({
    base: { cx: 150, cy: 200 },
    md: { cx: 300, cy: 210 },
    lg: { cx: 200, cy: 210 },
    '2xl': { cx: 210, cy: 210 },
  })
  const { getRelativeWeight } = useGaugeCtrl()

  const fillChartData = async () => {
    setChartdata([])
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < gauges.length; i++) {
      const gauge = gauges[i]
      // eslint-disable-next-line no-await-in-loop
      const gaugeRelativeWeight = await getRelativeWeight(gauge.gaugeAddress)
      if (gaugeRelativeWeight)
        setChartdata(prev => [
          ...prev,
          { name: gauge.name, value: gaugeRelativeWeight },
        ])
    }
  }

  const handleFilterWeights = async (value: WEIGHT) => {
    if (value === WEIGHT.ALL_WEIGHTS) {
      await fillChartData()
    } else {
      setChartdata([])
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < gauges.length; i++) {
        const gauge = gauges[i]
        const filteredVotes = votes.filter(
          (v: Vote) =>
            v.user === address && gauge.gaugeAddress === v.gaugeAddress,
        )
        const accumulatedWeight = filteredVotes.reduce(
          (prev, current) => Number(prev) + Number(current.weight),
          0,
        )

        setChartdata(prev => [
          ...prev,
          { name: gauge.name, value: accumulatedWeight },
        ])
      }
    }
  }

  useEffect(() => {
    fillChartData()
  }, [gauges])

  return (
    <Flex direction="column" w={{ base: '100%' }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="flex-end"
        w="100%"
      >
        <Select
          onChange={event => handleFilterWeights(event.target.value as WEIGHT)}
          maxW={{ base: 'full', md: '143px' }}
        >
          <option value={WEIGHT.ALL_WEIGHTS}>All weights</option>
          <option disabled={isDisconnected} value={WEIGHT.MY_WEIGHT}>
            My weight
          </option>
        </Select>
      </Flex>

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
