import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import { DAILY_HOLDERS } from './queries'

type GetHoldersResponse = {
  hiIQHolders: { amount: number; day: string }[]
}

export const HiIQHoldersApi = createApi({
  reducerPath: 'HiIQHoldersApi',
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
    getHiIQHolders: builder.query<{ amount: number; day: string }[], string>({
      query: (interval: string) => ({
        document: DAILY_HOLDERS,
        variables: {
          interval,
        },
      }),
      transformResponse: (response: GetHoldersResponse) => {
        return response.hiIQHolders
      },
    }),
  }),
})

export const { useGetHiIQHoldersQuery } = HiIQHoldersApi

export const { getHiIQHolders } = HiIQHoldersApi.endpoints
