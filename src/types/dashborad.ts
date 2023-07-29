import { Dict } from '@chakra-ui/utils'
import { ReactNode } from 'react'

export type graphComponent = {
  graphTitle: string
  isTreasuryPage?: boolean
  getRootProps: any
  areaGraphData?: Dict<number>[] | undefined
  graphData?: { name: string; amt: number }[] | undefined
  graphCurrentValue: number | undefined
  height?: number
  children: ReactNode
  areaGraph: boolean
  renderIQPercentChange?: string | boolean | undefined
}
