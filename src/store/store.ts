import { configureStore } from '@reduxjs/toolkit'
import { ensReducer, gaugesReducer, nftFarmReducer } from '@/store/slices'
import { stakeApi } from '@/services/stake'
import { HiIQHoldersApi } from '@/services/holders'
import { treasuryApi } from '@/services/treasury'

export const store = configureStore({
  reducer: {
    ens: ensReducer,
    gauges: gaugesReducer,
    nftFarms: nftFarmReducer,
    [stakeApi.reducerPath]: stakeApi.reducer,
    [HiIQHoldersApi.reducerPath]: HiIQHoldersApi.reducer,
    [treasuryApi.reducerPath]: treasuryApi.reducer,
  },
  middleware: (gDM) =>
    gDM({ serializableCheck: true })
      .concat(stakeApi.middleware)
      .concat(HiIQHoldersApi.middleware)
      .concat(treasuryApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
