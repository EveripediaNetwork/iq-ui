import { configureStore } from '@reduxjs/toolkit'
import { ensReducer, gaugesReducer, nftFarmReducer } from '@/store/slices'
import { stakeApi } from '@/services/stake'
import { IQHoldersApi } from '@/services/holders'
import { iqPriceApi } from '@/services/iqPrice'
import { gasPriceApi } from '@/services/gasPrice'
import { treasuryGraphqlApi } from '@/services/treasury/graphql'
import { treasuryRestApi } from '@/services/treasury/rest'

export const store = configureStore({
  reducer: {
    ens: ensReducer,
    gauges: gaugesReducer,
    nftFarms: nftFarmReducer,
    [stakeApi.reducerPath]: stakeApi.reducer,
    [IQHoldersApi.reducerPath]: IQHoldersApi.reducer,
    [treasuryGraphqlApi.reducerPath]: treasuryGraphqlApi.reducer,
    [treasuryRestApi.reducerPath]: treasuryRestApi.reducer,
    [iqPriceApi.reducerPath]: iqPriceApi.reducer,
    [gasPriceApi.reducerPath]: gasPriceApi.reducer,
  },
  middleware: (gDM) =>
    gDM({ serializableCheck: true })
      .concat(stakeApi.middleware)
      .concat(IQHoldersApi.middleware)
      .concat(treasuryGraphqlApi.middleware)
      .concat(treasuryRestApi.middleware)
      .concat(iqPriceApi.middleware)
      .concat(gasPriceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
