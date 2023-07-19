import { gql } from 'graphql-request'

export const DAILY_STAKED_IQ = gql`
  query GetDailyStakedIQ($startDate: Int, $endDate: Int) {
    dailyStakedIQ(startDate: $startDate, endDate: $endDate) {
      created
      amount
    }
  }
`
