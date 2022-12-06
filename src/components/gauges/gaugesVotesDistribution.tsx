import React, { useEffect, useState } from 'react'
import { Flex, Box, Text, Select } from '@chakra-ui/react'
import { PieChart, Pie, Cell } from 'recharts'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'

// TODO: fill this automatically
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

type ChartDataType = {
  name: string
  value: number
}

const GaugesVotesDistribution = () => {
  const [chartData, setChartdata] = useState<ChartDataType[]>()
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const { getRelativeWeight } = useGaugeCtrl()

  const fillChartData = async () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < gauges.length; i++) {
      const gauge = gauges[i]
      // eslint-disable-next-line no-await-in-loop
      const gaugeRelativeWeight = await getRelativeWeight(gauge.gaugeAddress)
      if (gaugeRelativeWeight)
        setChartdata([{ name: gauge.name, value: gaugeRelativeWeight }])
    }
  }

  useEffect(() => {
    fillChartData()
  }, [])

  return (
    <Flex direction="column">
      <Flex direction="row" justifyContent="space-between" w="100%">
        <Text fontWeight="bold">Votes Distribution</Text>
        <Select maxW="143px">
          <option>All weights</option>
          <option>My weight</option>
        </Select>
      </Flex>
      <Flex direction="row" justifyContent="center">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx={200}
            cy={200}
            labelLine={false}
            // label={renderCustomizedLabel}
            outerRadius={180}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData
              ? chartData.map((_: any, index: number) => (
                  <Cell
                    width={400}
                    height={400}
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
    </Flex>
  )
}

export default GaugesVotesDistribution
