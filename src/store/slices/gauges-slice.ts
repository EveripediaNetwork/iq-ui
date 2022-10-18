import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  gauges: Array(5).fill({
    name: 'UniswapV3',
    address: '0x3EF2...B4B0',
    gaugeAddress: '0x3EF2...B4B0',
  }),
  currentGauge: {
    name: 'UniswapV3',
    address: '0x3EF2...B4B0',
    gaugeAddress: '0x3EF2...B4B0',
  },
}

const gaugesSlice = createSlice({
  name: 'gauges',
  initialState,
  reducers: {
    setGauges(state, action) {
      const newState = {
        ...state,
        gauges: [
          ...state.gauges,
          {
            name: action.payload.name,
            address: action.payload.address,
            gaugeAddress: action.payload.address,
          },
        ],
      }
      return newState
    },
    setCurrentGauge(state, action) {
      const newState = {
        ...state,
        currentGauge: action.payload,
      }

      return newState
    },
  },
})

export const { setGauges } = gaugesSlice.actions
export default gaugesSlice.reducer
