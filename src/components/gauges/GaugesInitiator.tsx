import { nftFarms } from '@/data/GaugeData'
import React from 'react'
import GaugesSetter from './GaugesSetter'

const GaugesInitiator = () => {
  return (
    <>
      {nftFarms.map(nftFarm => (
        <GaugesSetter nftFarmAddress={nftFarm.address} />
      ))}
    </>
  )
}

export default GaugesInitiator
