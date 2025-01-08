import { HYDRATE } from 'next-redux-wrapper'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const REFETCH_INTERVAL = 60 * 30
const CACHE_DURATION = 60 * 60

export const gasPriceApi = createApi({
  reducerPath: 'gasPriceApi',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return null
  },
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/gas-price',
  }),
  refetchOnMountOrArgChange: REFETCH_INTERVAL,
  keepUnusedDataFor: CACHE_DURATION,
  tagTypes: ['GasPrice'],
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getGasPrice: builder.query<
      {
        response?: number
        status: boolean
        message: string
      },
      void
    >({
      query: () => '',
      providesTags: ['GasPrice'],
    }),
  }),
})
export const { useGetGasPriceQuery } = gasPriceApi
