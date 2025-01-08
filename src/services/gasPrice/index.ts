import { HYDRATE } from 'next-redux-wrapper'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
  refetchOnMountOrArgChange: 60 * 30,
  keepUnusedDataFor: 60 * 60,
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
