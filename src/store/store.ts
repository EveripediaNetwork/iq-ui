import { configureStore } from '@reduxjs/toolkit'
import { ensReducer, gaugesReducer, nftFarmReducer } from '@/store/slices'
import { stakeApi } from '@/services/stake'

export const store = configureStore({
  reducer: {
    ens: ensReducer,
    gauges: gaugesReducer,
    nftFarms: nftFarmReducer,
    [stakeApi.reducerPath]: stakeApi.reducer,
  },
  middleware: (gDM) =>
    gDM({ serializableCheck: true }).concat(stakeApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
