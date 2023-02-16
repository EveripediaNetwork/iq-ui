import { nftFarmAddresses } from '@/data/GaugeData'
import React from 'react'
import GaugesSetter from './GaugesSetter'

const GaugesInitiator = () => {

  return (
    <>
      {nftFarmAddresses.map(addr => (
        <GaugesSetter nftFarmAddress={addr} />
      ))}
    </>
  )
}

export default GaugesInitiator
