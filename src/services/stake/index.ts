import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import { GET_STAKE_VOLUME } from './queries'

type GetStakeResponse = {
  volumes: string[]
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
  endpoints: builder => ({
    getStakeValue: builder.query<
      string[],
      { startDate: number; endDate: number }
    >({
      query: ({ startDate, endDate }) => ({
        document: GET_STAKE_VOLUME,
        variables: {
          startDate,
          endDate,
        },
      }),
      transformResponse: (response: GetStakeResponse) => response.volumes,
    }),
  }),
})

export const { useGetStakeValueQuery } = stakeApi

export const { getStakeValue } = stakeApi.endpoints
