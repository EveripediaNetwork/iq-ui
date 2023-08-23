import { PieProps } from 'recharts'

export type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

export type ChartDataType = {
  name: string
  value: number
}

interface ChartConstantTreasury {
  light: string
  dark: string
}

interface ChartConstantNonTreasuryType {
  [key: string]: ChartConstantTreasury
}

export type ChartConstantType =
  | ChartConstantTreasury[]
  | ChartConstantNonTreasuryType
