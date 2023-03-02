import { nftFarmAddresses } from '@/data/GaugeData'
import { createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
  stakingTypes: string[] | undefined
  currentStakingAddress: string
}

const initialState: InitialStateType = {
  stakingTypes: nftFarmAddresses,
  currentStakingAddress: nftFarmAddresses ? nftFarmAddresses[1] : '',
}

const nftFarmSlice = createSlice({
  name: 'stakingTypes',
  initialState,
  reducers: {
    setCurrentStaking(state, action) {
      state.currentStakingAddress = action.payload
    },
  },
})

export const { setCurrentStaking } = nftFarmSlice.actions
export default nftFarmSlice.reducer
