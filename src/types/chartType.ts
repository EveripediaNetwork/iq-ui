import { PieProps } from 'recharts'

export type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

export type ChartDataType = {
  name: string
  value: number
}
