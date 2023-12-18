import { EP_COINGECKO_BASE_URL } from '@/data/LockConstants'
import { HYDRATE } from 'next-redux-wrapper'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TGetTokenRatePayload = {
  tokenName: string
  versusCurrency: string
}

export const tokenRateApi = createApi({
  reducerPath: 'tokenRateApi',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return null
  },
  baseQuery: fetchBaseQuery({
    baseUrl: EP_COINGECKO_BASE_URL,
  }),
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  endpoints: builder => ({
    getTokenRate: builder.query<
      {
        [key: string]: {
          usd: number
        }
      },
      TGetTokenRatePayload
    >({
      query: ({ tokenName, versusCurrency }) =>
        `/price?ids=${tokenName}&vs_currencies=${versusCurrency}`,
    }),
  }),
})
export const { useGetTokenRateQuery } = tokenRateApi

export const { getTokenRate } = tokenRateApi.endpoints
