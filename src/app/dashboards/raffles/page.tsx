import React from 'react'
import { Metadata } from 'next'
import RafflePage from '@/components/client/RafflePage'

export const metadata: Metadata = {
    title: 'Raffle Page',
    description:
      'See all the NFT raffles IQ stakers have won.',
    openGraph: {
      title: 'NFT Raffles',
      description:
        'See all the NFT raffles IQ stakers have won.',
    },
}

const Raffles = () => {
  return (
   <RafflePage/>
  )
}

export default Raffles
