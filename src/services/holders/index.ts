import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import config from '@/config'
import { DAILY_HOLDERS } from './queries'

type GetHoldersResponse = {
  IQHolders: { amount: number; day: string }[]
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
  }),
})

export const { useGetIQHoldersQuery } = IQHoldersApi

export const { getIQHolders } = IQHoldersApi.endpoints
