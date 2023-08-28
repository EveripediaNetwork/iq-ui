import { gql } from 'graphql-request'

export const DAILY_HOLDERS = gql`
  query IQHolders($interval: IntervalByDays ) {
    IQHolders(interval: $interval) {
      amount
      day
    }
  }
`
