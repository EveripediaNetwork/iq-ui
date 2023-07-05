import { gql } from 'graphql-request'

export const GET_STAKE_VOLUME = gql`
  query GetStakeVolume($startDate: Int!, $endDate: Int!) {
    stakeVolume(startDate: $startDate, endDate: $endDate) {
      value
    }
  }
`
