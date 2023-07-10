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
  '7DAYS' = '7days',
  '14DAYS' = '14days',
  '30DAYS' = '30days',
  '90DAYS' = '90days',
}

export const STAKE_GRAPH_PERIODS = [
  {
    period: StakeGraphPeriod['7DAYS'],
    label: '7D',
  },
  {
    period: StakeGraphPeriod['14DAYS'],
    label: '14D',
  },
  {
    period: StakeGraphPeriod['30DAYS'],
    label: '30D',
  },
  {
    period: StakeGraphPeriod['90DAYS'],
    label: '90D',
  },
]
