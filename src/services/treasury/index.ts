import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import { DAILY_TREASURY } from './queries'

type GetTreasuryResponse = {
  dailyTreasury: { created: string; totalValue: number }[]
}

type TreasuryValueParams = {
  totalValue: number
  id: number
  startDate: number
  endDate: number
}

export const stakeApi = createApi({
  reducerPath: 'stakeApi',
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
    getTreasuryValue: builder.query<
      { created: string; totalValue: number }[],
      TreasuryValueParams
    >({
      query: ({ startDate, endDate }: TreasuryValueParams) => ({
        document: DAILY_TREASURY,
        variables: {
          startDate,
          endDate,
        },
      }),
      transformResponse: (response: GetTreasuryResponse) => {
        return response.dailyTreasury
      },
    }),
  }),
})

export const { useGetTreasuryValueQuery } = stakeApi

export const { getTreasuryValue } = stakeApi.endpoints
