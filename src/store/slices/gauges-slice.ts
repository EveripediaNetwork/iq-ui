import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  gauges: [
    {
      name: 'UniswapV3',
      address: '0x3EF2...B4B0',
      gaugeAddress: '0x3EF2...B4B0',
    },
    {
      name: 'Sushi',
      address: '0x3EF2...B4B0',
      gaugeAddress: '0x3EF2...B4B0',
    },
    {
      name: 'CRV+TUSD',
      address: '0x3EF2...B4B0',
      gaugeAddress: '0x3EF2...B4B0',
    },
    {
      name: 'UniswapV2',
      address: '0x3EF2...B4B0',
      gaugeAddress: '0x3EF2...B4B0',
    },
  ],
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
      const existing = state.gauges.find(g => g.name === action.payload.name)
      if (existing) return state

      const newState = {
        ...state,
        gauges: [
          ...state.gauges,
          {
            name: action.payload.name,
            address: action.payload.address,
            gaugeAddress: action.payload.gaugeAddress,
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

export const { setGauges, setCurrentGauge } = gaugesSlice.actions
export default gaugesSlice.reducer
