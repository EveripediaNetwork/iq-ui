export enum GraphPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export const GRAPH_PERIODS = [
  {
    period: GraphPeriod.DAY,
    label: '1D',
  },
  {
    period: GraphPeriod.WEEK,
    label: '1W',
  },
  {
    period: GraphPeriod.MONTH,
    label: '1M',
  },
  {
    period: GraphPeriod.YEAR,
    label: '1Y',
  },
]

export enum StakeGraphPeriod {
  '30DAYS' = '30days',
  '90DAYS' = '90days',
  '1Y' = '365days',
  ALL = 'All',
}
