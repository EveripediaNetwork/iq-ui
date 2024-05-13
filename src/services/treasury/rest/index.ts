import { ContractDetailsType } from '@/types/TreasuryTokenType'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

export type TResponseData = {
  response: ContractDetailsType[]
}

type TProtocolDetailsParam = { protocolId: string; id: string }

export const treasuryRestApi = createApi({
  reducerPath: 'treasuryRestApi',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return null
  },
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getWalletTokens: builder.query<ContractDetailsType[], string>({
      query: (walletAddress: string) => ({
        url: `fetch-tokens?walletAddress=${walletAddress}`,
      }),
      transformResponse: (response: TResponseData) => {
        const formatedResponse = response.response
        return formatedResponse
      },
    }),
    getProtocolDetails: builder.query({
      query: ({ protocolId, id }: TProtocolDetailsParam) => ({
        url: `protocols?protocolId=${protocolId}&id=${id}`,
      }),
      transformResponse: ({ response }) => {
        return response?.portfolio_item_list
      },
    }),
  }),
})

export const { useGetWalletTokensQuery, useGetProtocolDetailsQuery } =
  treasuryRestApi

export const { getWalletTokens, getProtocolDetails } = treasuryRestApi.endpoints
