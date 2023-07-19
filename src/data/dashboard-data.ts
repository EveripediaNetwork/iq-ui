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

export const CUSTOM_GRAPH_PERIODS = [
  {
    period: StakeGraphPeriod['30DAYS'],
    label: '30D',
  },
  {
    period: StakeGraphPeriod['90DAYS'],
    label: '90D',
  },
  {
    period: StakeGraphPeriod['1Y'],
    label: '1Y',
  },
  {
    period: StakeGraphPeriod['ALL'],
    label: 'All',
  },
]
