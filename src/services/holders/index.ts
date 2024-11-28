import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import {
  DAILY_HOLDERS,
  HIIQ_HOLDERS_COUNT,
  HIIQ_HOLDERS_RANK,
  SEARCH_HIIQ_HOLDERS_BY_ADDRESS,
} from './queries'

type GetHoldersResponse = {
  IQHolders: { amount: number; day: string }[]
}

type GetHIIQHoldersRankResponse = {
  hiIQHoldersRank: {
    address: string
    tokens: string
    updated: number
  }[]
}

type SearchHIIQHoldersByAddressResponse = {
  searchHiIQHoldersByAddress: {
    address: string
    tokens: string
    updated: number
  }
}

export const IQHoldersApi = createApi({
  reducerPath: 'IQHoldersApi',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return null
  },
  baseQuery: graphqlRequestBaseQuery({ url: config.graphqlUrl }),
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getIQHolders: builder.query<{ amount: number; day: string }[], string>({
      query: (interval: string) => ({
        document: DAILY_HOLDERS,
        variables: {
          interval,
        },
      }),
      transformResponse: (response: GetHoldersResponse) => {
        return response.IQHolders
      },
    }),
    getHIIQHoldersRank: builder.query<
      {
        address: string
        tokens: string
        updated: number
      }[],
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => ({
        document: HIIQ_HOLDERS_RANK,
        variables: {
          limit,
          offset,
        },
      }),
      transformResponse: (response: GetHIIQHoldersRankResponse) => {
        return response.hiIQHoldersRank
      },
    }),
    getHIIQHoldersCount: builder.query<number, void>({
      query: () => ({
        document: HIIQ_HOLDERS_COUNT,
      }),
      transformResponse: (response: {
        hiIQHoldersCount: { amount: number }[]
      }) => {
        return response.hiIQHoldersCount[0].amount
      },
    }),
    searchHiIQHoldersByAddress: builder.mutation<
      {
        address: string
        tokens: string
        updated: number
      },
      { address: string }
    >({
      query: ({ address }) => ({
        document: SEARCH_HIIQ_HOLDERS_BY_ADDRESS,
        variables: {
          address,
        },
      }),
      transformResponse: (response: SearchHIIQHoldersByAddressResponse) => {
        return response.searchHiIQHoldersByAddress
      },
    }),
  }),
})

export const {
  useGetIQHoldersQuery,
  useGetHIIQHoldersRankQuery,
  useGetHIIQHoldersCountQuery,
  useSearchHiIQHoldersByAddressMutation,
} = IQHoldersApi

export const {
  getIQHolders,
  getHIIQHoldersRank,
  getHIIQHoldersCount,
  searchHiIQHoldersByAddress,
} = IQHoldersApi.endpoints
