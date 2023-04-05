import React from 'react'
import { PieProps, Sector } from 'recharts'

type PieActiveShape = PieProps['activeShape']
const RenderActiveShape: PieActiveShape = (props: {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: { name: string }
  percent: number
}) => {
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

export default RenderActiveShape
