import { HYDRATE } from 'next-redux-wrapper'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TResponseData = {
  response?: any
  status: boolean
  message: string
}

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
  endpoints: (builder) => ({
    getIqPrice: builder.query<TResponseData, string>({
      query: (tokenName: string) => `?tokenName=${tokenName}`,
      transformResponse: (response: TResponseData, _meta, arg: string) => {
        const formatedResponse = response.response?.data?.[arg]
        return {
          response: formatedResponse,
          status: response.status,
          message: response.message,
        }
      },
    }),
  }),
})
export const { useGetIqPriceQuery } = iqPriceApi

export const { getIqPrice } = iqPriceApi.endpoints
