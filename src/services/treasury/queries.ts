import { gql } from 'graphql-request'

export const DAILY_TREASURY = gql`
  query GetDailyTreasury($startDate: Int, $endDate: Int) {
    dailyTreasury(startDate: $startDate, endDate: $endDate) {
      id
      totalValue
      created
      updated
    }
  }
`
