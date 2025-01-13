import React from 'react'
import { Box, Text, CircularProgress, VStack } from '@chakra-ui/react'
import { PieChart, Pie, Cell } from 'recharts'
import {
  ChartType,
  ChartConstantTreasury,
  ChartConstantNonTreasury,
} from '@/types/chartType'
import RenderActiveShape from './RenderActiveShape'
import { useTranslations } from 'next-intl'

const Chart = ({
  chartData,
  boxSize,
  radius,
  colorMode,
  onPieEnter,
  activeIndex,
  CHART_COLORS,
  isTreasuryPage = false,
}: ChartType) => {
  const t = useTranslations('treasury')

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
            innerRadius={radius?.cx}
            outerRadius={radius?.cy}
            activeShape={RenderActiveShape}
            onMouseEnter={onPieEnter}
          >
            {isTreasuryPage
              ? chartData.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      colorMode === 'light'
                        ? (CHART_COLORS as ChartConstantTreasury[])[idx]?.light
                        : (CHART_COLORS as ChartConstantTreasury[])[idx]?.dark
                    }
                    className="pie-cell"
                  />
                ))
              : chartData.map((item) => (
                  <Cell
                    key={`cell-${item}`}
                    fill={
                      colorMode === 'light'
                        ? (CHART_COLORS as ChartConstantNonTreasury)[item.name]
                            .light
                        : (CHART_COLORS as ChartConstantNonTreasury)[item.name]
                            .dark
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
            <Text color="tooltipColor">{t('fetchingChartData')}</Text>
          </VStack>
        </Box>
      )}
    </Box>
  )
}

export default Chart
