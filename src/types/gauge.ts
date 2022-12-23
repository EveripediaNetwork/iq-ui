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

export interface Stake {
  startTimestamp: string
  endingTimestamp: string
}

export enum SALESTATUS {
  PAUSED = 0,
  WHITELIST = 1,
  PUBLIC = 2,
}

export enum WEEKS {
  THIS_WEEK = 'this',
  LAST_WEEK = 'last',
}
