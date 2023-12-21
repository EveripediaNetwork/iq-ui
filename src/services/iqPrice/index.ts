import { EP_COINGECKO_URL } from '@/data/LockConstants'
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
    baseUrl: EP_COINGECKO_URL,
  }),
  refetchOnMountOrArgChange: 60,
  refetchOnFocus: true,
  endpoints: builder => ({
    getIqPrice: builder.query<
      {
        [key: string]: {
          usd: number
        }
      },
      void
    >({
      query: () => '',
    }),
  }),
})
export const { useGetIqPriceQuery } = iqPriceApi
