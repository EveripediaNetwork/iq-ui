import { PieProps } from 'recharts'

export type ConstantType = { [key: string]: number } | undefined

export type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

export type ChartDataType = {
  name: string
  value: number
}

export interface ChartConstantTreasury {
  light: string
  dark: string
}

export interface ChartConstantNonTreasury {
  [key: string]: ChartConstantTreasury
}

  export type ChartType = {
    chartData: ChartDataType[]
    boxSize: ConstantType
    spacing: ConstantType
    radius: ConstantType
    colorMode: string
    onPieEnter?: OnPieEnter
    activeIndex?: number
    CHART_COLORS: ChartConstantTreasury[] | ChartConstantNonTreasury
    isTreasuryPage: boolean
  }