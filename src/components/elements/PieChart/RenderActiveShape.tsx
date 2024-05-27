import { checkIsAddress } from '@/utils/checkIsAddress'
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
  const isAddress: boolean = checkIsAddress(payload.name)
  const displaySector = () => {
    if (payload.name === 'Others' || isAddress) {
      return false
    }
    return true
  }
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        fontSize="12"
        textAnchor="middle"
        fill={fill}
        fontWeight="semibold"
      >
        {displaySector() && payload.name} {`(${(percent * 100).toFixed(1)}%)`}
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
      {displaySector() && (
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      )}
    </g>
  )
}

export default RenderActiveShape
