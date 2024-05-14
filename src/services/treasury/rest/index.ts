import { ContractDetailsType } from '@/types/TreasuryTokenType'
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import {
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { fraxLendQueryObject } from '../queries'

export type TResponseData = {
  response: ContractDetailsType[]
}

type TProtocolDetailsParam = { protocolId: string; id: string }

type CustomQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {}
>

const returnTokenIndexFromFrax = (token: string) => {
  if (token === 'cvxFXS') {
    return 15
  }
  return 20
}

const customBaseQuery: CustomQuery = async (args, api, extraOptions) => {
  let baseUrl = '/api'

  if (typeof args === 'string') {
    if (args.startsWith('https://api.frax.finance')) {
      baseUrl = '' // Override for FRAX finance API requests
    } else if (args.startsWith('https://api.thegraph.com')) {
      baseUrl = '' // Override for The Graph API requests
    }
  }

  return fetchBaseQuery({ baseUrl })(args, api, extraOptions)
}

export const treasuryRestApi = createApi({
  reducerPath: 'treasuryRestApi',
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return null
  },
  // baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  baseQuery: customBaseQuery,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getWalletTokens: builder.query<ContractDetailsType[], string>({
      query: (walletAddress: string) =>
        `fetch-tokens?walletAddress=${walletAddress}`,
      transformResponse: (response: TResponseData) => {
        const formatedResponse = response.response
        return formatedResponse
      },
    }),
    getProtocolDetails: builder.query({
      query: ({ protocolId, id }: TProtocolDetailsParam) =>
        `protocols?protocolId=${protocolId}&id=${id}`,
      transformResponse: ({ response }) => {
        return response?.portfolio_item_list
      },
    }),
    getFraxETHSummary: builder.query<number, void>({
      query: () => ({
        url: 'https://api.frax.finance/v2/frxeth/summary/latest',
      }),
      transformResponse: (response: any) => {
        return response.sfrxethApr
      },
    }),
    getGraphData: builder.query<number, string>({
      query: () => ({
        url: 'https://api.thegraph.com/subgraphs/name/frax-finance-data/fraxlend-subgraph---mainnet',
        headers: {
          accept: '*/*',
          'accept-language':
            'en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4',
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(fraxLendQueryObject),
      }),
      transformResponse: (response: any, _meta, arg) => {
        const NUMBER_OF_SECONDS = 365 * 24 * 3600
        const pairData = response?.data.pairs[returnTokenIndexFromFrax(arg)]
        const utilizationRate =
          Number(pairData.dailyHistory[0]?.utilization) / 100_000
        const interestPerSecond =
          Number(pairData.dailyHistory[0]?.interestPerSecond) / 10 ** 18
        const apr =
          interestPerSecond * NUMBER_OF_SECONDS * utilizationRate * 100
        return apr
      },
    }),
  }),
})

export const {
  useGetWalletTokensQuery,
  useGetProtocolDetailsQuery,
  useGetFraxETHSummaryQuery,
  useGetGraphDataQuery,
} = treasuryRestApi

export const {
  getWalletTokens,
  getProtocolDetails,
  getFraxETHSummary,
  getGraphData,
} = treasuryRestApi.endpoints
