import { Gauge, Vote } from '@/types/gauge'
import { createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
  gauges: Array<Gauge>
  currentGauge: Gauge | undefined
  votes: Vote[]
}

const initialState: InitialStateType = {
  gauges: [],
  currentGauge: undefined,
  votes: [],
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
    setVotes(state, action) {
      const newState = {
        ...state,
        votes: action.payload,
      }

      return newState
    },
  },
})

export const { setGauges, setCurrentGauge, setVotes } = gaugesSlice.actions
export default gaugesSlice.reducer
