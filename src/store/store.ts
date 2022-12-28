import { configureStore } from '@reduxjs/toolkit'
import { ensReducer, gaugesReducer } from '@/store/slices'

export const store = configureStore({
  reducer: {
    ens: ensReducer,
    gauges: gaugesReducer,
  },
  middleware: gDM => gDM({ serializableCheck: true }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
