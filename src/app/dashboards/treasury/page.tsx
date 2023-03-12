import TreasuryPage from '@/components/client/TreasuryPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: "Treasury Page",
    description:"See all the cryptocurrencies and NFTs held in BrainDAO’s diversified treasury. ",
    openGraph: {
        title: 'BrainDAO Treasury',
        description:'See all the cryptocurrencies and NFTs held in BrainDAO’s diversified treasury.',
    }
}

const Treasury = () => {
  return (
    <TreasuryPage/>
  )
}

export default Treasury
