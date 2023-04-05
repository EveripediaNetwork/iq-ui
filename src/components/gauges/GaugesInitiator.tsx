import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'
import GaugesSetter from './GaugesSetter'

const GaugesInitiator = () => {
  const { stakingTypes } = useSelector((state: RootState) => state.nftFarms)
  return (
    <>
      {stakingTypes?.map(nftFarm => (
        <GaugesSetter nftFarmAddress={nftFarm} />
      ))}
    </>
  )
}

export default GaugesInitiator
