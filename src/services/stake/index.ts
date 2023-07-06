import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import { DAILY_STAKED_IQ } from './queries'

type GetStakeResponse = {
  dailyStakedIQ: string[]
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
    getStakeValue: builder.query<string[], void>({
      query: () => ({
        document: DAILY_STAKED_IQ,
      }),
      transformResponse: (response: GetStakeResponse) => {
        return response.dailyStakedIQ
      },
    }),
  }),
})

export const { useGetStakeValueQuery } = stakeApi

export const { getStakeValue } = stakeApi.endpoints
