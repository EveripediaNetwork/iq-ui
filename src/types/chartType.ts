import { PieProps } from 'recharts'

export type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

export type ChartDataType = {
  name: string
  value: number
}

interface ChartConstantNonTreasury {
  light: string
  dark: string
}

interface ChartConstantTreasury {
  light: string
  dark: string
}

export type ChartConstantNonTreasuryType = {
  [key: string]: ChartConstantNonTreasury
}

export type ChartConstantTreasuryType = ChartConstantTreasury[]

// const test: ChartConstantNonTreasuryType | ChartConstantTreasuryType = [
//   {light:"dd", dark:"gg"}
// ]
// console.log(typeof test)
