import { PieProps } from 'recharts'

export type ConstantType = { [key: string]: number } | undefined


export type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

export type ChartDataType = {
  name: string
  value: number
}

interface ChartConstantTreasury {
   "light": string
    "dark": string
}

interface ChartConstantNonTreasuryType {
  [key: string]: ChartConstantTreasury
}

// export type ChartConstantType =
//   | ChartConstantTreasury[]
//   | ChartConstantNonTreasuryType

export type ChartType = 
| {
  chartData: ChartDataType[],
  boxSize: ConstantType,
  spacing: ConstantType,
  radius: ConstantType,
  colorMode: string,
  onPieEnter?: OnPieEnter,
  activeIndex?: number,
  CHART_COLORS: ChartConstantNonTreasuryType,
  isTreasuryPage: false
}
| {
  chartData: ChartDataType[],
  boxSize: ConstantType,
  spacing: ConstantType,
  radius: ConstantType,
  colorMode: string,
  onPieEnter?: OnPieEnter,
  activeIndex?: number,
  CHART_COLORS: ChartConstantTreasury[],
  isTreasuryPage: true
}
