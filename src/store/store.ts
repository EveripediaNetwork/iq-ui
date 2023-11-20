import { configureStore } from '@reduxjs/toolkit'
import { ensReducer, gaugesReducer, nftFarmReducer } from '@/store/slices'
import { stakeApi } from '@/services/stake'
import { IQHoldersApi } from '@/services/holders'
import { treasuryApi } from '@/services/treasury'
import { iqPriceApi } from '@/services/iqPrice'

export const store = configureStore({
  reducer: {
    ens: ensReducer,
    gauges: gaugesReducer,
    nftFarms: nftFarmReducer,
    [stakeApi.reducerPath]: stakeApi.reducer,
    [IQHoldersApi.reducerPath]: IQHoldersApi.reducer,
    [treasuryApi.reducerPath]: treasuryApi.reducer,
    [iqPriceApi.reducerPath]: iqPriceApi.reducer,
  },
  middleware: (gDM) =>
    gDM({ serializableCheck: true })
      .concat(stakeApi.middleware)
      .concat(IQHoldersApi.middleware)
      .concat(treasuryApi.middleware)
      .concat(iqPriceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
