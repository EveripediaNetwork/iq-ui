import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import { DAILY_TREASURY } from './queries'

type GetTreasuryResponse = {
  dailyTreasury: { created: string; totalValue: string }[]
}

type TreasuryValueParams = {
  startDate: number
  endDate: number
}

export const treasuryApi = createApi({
  reducerPath: 'treasuryApi',
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
      { created: string; totalValue: string }[],
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

export const { useGetTreasuryValueQuery } = treasuryApi

export const { getTreasuryValue } = treasuryApi.endpoints
