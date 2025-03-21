import { gql } from 'graphql-request'

export const DAILY_HOLDERS = gql`
  query IQHolders($interval: IntervalByDays ) {
    IQHolders(interval: $interval) {
      amount
      day
    }
  }
`

export const HIIQ_HOLDERS_RANK = gql`
  query HIIQHoldersRank( $limit: Int, $offset: Int ) {
    hiIQHoldersRank(limit: $limit, offset: $offset) {
      address
      tokens
      created
      updated
    }
  }

`

export const HIIQ_HOLDERS_COUNT = gql`
  query HIIQHoldersCount {
    hiIQHoldersCount {
      amount
    }
  }
`

export const SEARCH_HIIQ_HOLDERS_BY_ADDRESS = gql`
  query SearchHIIQHoldersByAddress($address: String!) {
    searchHiIQHoldersByAddress(address: $address) {
      address
      tokens
      updated
    }
  }
`
