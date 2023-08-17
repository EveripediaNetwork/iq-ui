import { gql } from 'graphql-request'

export const DAILY_HOLDERS = gql`
  query hiIQHolders($interval: IntervalByDays ) {
    hiIQHolders(interval: $interval) {
      amount
      day
    }
  }
`
