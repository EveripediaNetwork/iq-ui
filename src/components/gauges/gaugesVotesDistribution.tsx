import React, { memo, useState, useEffect, useCallback } from 'react'
import { useBreakpointValue, useColorMode } from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import { breakpoints } from '@/data/BreakpointData'
import { ChartDataType, OnPieEnter } from '@/types/chartType'
import { VOTE_CHART_COLORS } from '@/data/treasury-data'
import PieWrapper from '../elements/stakeCommon/PieWrapper'
import Chart from '../elements/PieChart/Chart'

const GaugesVotesDistribution = () => {
  const [chartData, setChartdata] = useState<ChartDataType[]>([])
  const gauges: Gauge[] = useAppSelector((state) => state.gauges.gauges)
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
    const data = gauges.map(async (gauge) => {
      const gaugeRelativeWeight = await getRelativeWeight(gauge.gaugeAddress)
      return { name: gauge.name, value: gaugeRelativeWeight }
    })
    const result = await Promise.all(data)
    return result
  }

  useEffect(() => {
    const constructChartData = async () => {
      const data = await fillChartData()
      if (data) {
        setChartdata(data)
      }
    }
    constructChartData()
  }, [gauges])

  return (
    <PieWrapper>
      <Chart
        boxSize={boxSize}
        spacing={spacing}
        onPieEnter={onPieEnter}
        radius={radius}
        chartData={chartData}
        activeIndex={activeIndex}
        colorMode={colorMode}
        CHART_COLORS={VOTE_CHART_COLORS}
      />
    </PieWrapper>
  )
}
export default memo(GaugesVotesDistribution)
