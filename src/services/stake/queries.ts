import { gql } from 'graphql-request'

export const DAILY_STAKED_IQ = gql`
  {
    dailyStakedIQ {
      created
      amount
    }
  }
`
