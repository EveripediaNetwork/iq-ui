import React from 'react'
import Ghost2 from './Ghost2'

const Ghost = () => {
  const nftFarmAddresses = [
    '0x10f0d0409a6c1626A85075E00d4FDa8733d5236C',
    '0xfD8f558D4AB0c5dD3D240c780B549F298420A27A',
  ]
  return (
    <>
      {nftFarmAddresses.map(addr => (
        <Ghost2 nftFarmAddress={addr} />
      ))}
    </>
  )
}

export default Ghost
