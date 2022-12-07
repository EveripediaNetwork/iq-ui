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
