import { HYDRATE } from 'next-redux-wrapper'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const iqPriceApi = createApi({
  reducerPath: 'iqPriceApi',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return null
  },
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/cmc-token-details',
  }),
  refetchOnMountOrArgChange: 60,
  refetchOnFocus: true,
  endpoints: builder => ({
    getIqPrice: builder.query<
      {
        response?: any
        status: boolean
        message: string
      },
      string
    >({
      query: (tokenName: string) => `?tokenName=${tokenName}`,
    }),
  }),
})
export const { useGetIqPriceQuery } = iqPriceApi
