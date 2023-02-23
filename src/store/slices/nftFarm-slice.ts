import { nftFarmAddresses } from '@/data/GaugeData'
import { createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
  stakingTypes: string[] | undefined
  currentStakingAddress: string | undefined
}

const initialState: InitialStateType = {
  stakingTypes: nftFarmAddresses,
  currentStakingAddress: nftFarmAddresses
    ? nftFarmAddresses[0]
    : '0xfD8f558D4AB0c5dD3D240c780B549F298420A27A',
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
