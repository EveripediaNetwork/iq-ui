import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'

// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

const GaugesVotesDistribution = () => {
  const [chartData, setChartdata] = useState<any>()
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const { getRelativeWeight } = useGaugeCtrl()

  const fillChartData = async () => {
    for (let i = 0; i < gauges.length; i++) {
      const gauge = gauges[i]
      const gaugeRelativeWeight = await getRelativeWeight(gauge.gaugeAddress)
      console.log(gaugeRelativeWeight)

      if (gaugeRelativeWeight)
        setChartdata([{ name: gauge.name, value: gaugeRelativeWeight }])
    }
  }

  useEffect(() => {
    fillChartData()
  }, [])

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        // label={renderCustomizedLabel}
        outerRadius={80}
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
  )
}

export default GaugesVotesDistribution
