import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  gauges: [
    {
      name: 'UniswapV2',
      address: '0xca2B58781C6c928b8B7d181bD4c998C206a1AD7D',
      gaugeAddress: '0xca2B58781C6c928b8B7d181bD4c998C206a1AD7D',
    },
  ],
  currentGauge: {
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
