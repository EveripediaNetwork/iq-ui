export interface Gauge {
  name: string
  address: string
  gaugeAddress: string
}

export interface Vote {
  user: string
  voteDate: string
  gaugeAddress: string
  weight: number
}

export enum WEEKS {
  THIS_WEEK = 'this',
  LAST_WEEK = 'last'
}