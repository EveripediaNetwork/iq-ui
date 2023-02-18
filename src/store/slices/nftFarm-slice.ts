import { nftFarms } from '@/data/GaugeData'
import { createSlice } from '@reduxjs/toolkit'

type NFTStakingType = {
  name: string
  address: string
}

type InitialStateType = {
  stakingTypes: NFTStakingType[]
  currentStakingAddress: string
}

const initialState: InitialStateType = {
  stakingTypes: nftFarms,
  currentStakingAddress: nftFarms[0].address,
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
