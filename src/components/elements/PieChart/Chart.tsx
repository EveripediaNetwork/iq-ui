import React from 'react'
import { Box, Text, CircularProgress, VStack } from '@chakra-ui/react'
import { PieChart, Pie, Cell } from 'recharts'
import { ChartDataType, OnPieEnter } from '@/types/chartType'
import RenderActiveShape from './RenderActiveShape'

type ConstantType = { [key: string]: number } | undefined
type ChartConstantType = {
  [key: string]: {
    light: string
    dark: string
  }
}
const Chart = ({
  chartData,
  boxSize,
  spacing,
  radius,
  colorMode,
  onPieEnter,
  activeIndex,
  CHART_COLORS,
  TREASURY_CHART_COLORS
}: {
  chartData: ChartDataType[]
  boxSize: ConstantType
  spacing: ConstantType
  radius: ConstantType
  colorMode: string
  activeIndex?: number
  onPieEnter?: OnPieEnter
  CHART_COLORS?: ChartConstantType,
  TREASURY_CHART_COLORS?: { light: string; dark: string }[],
}) => {
  return (
    <Box>
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
            activeShape={RenderActiveShape}
            onMouseEnter={onPieEnter}
          >
            {TREASURY_CHART_COLORS && chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colorMode === 'light'
                    ? TREASURY_CHART_COLORS[index].light
                    : TREASURY_CHART_COLORS[index].dark
                }
                className="pie-cell"
              />
            ))}
            {CHART_COLORS && chartData.map((dt, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colorMode === 'light'
                    ? CHART_COLORS[dt.name].light
                    : '#FFB3D7'
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
          width={200}
          height={200}
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

export default Chart
