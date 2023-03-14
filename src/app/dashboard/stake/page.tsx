import StakePage from '@/components/client/StakePage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Stake Page',
  description:
    'Stake IQ to earn IQ token rewards and NFT raffles. The more IQ staked and longer you stake for the greater the rewards you earn and the chance of winning NFTs.',
  openGraph: {
    title: 'IQ Stake',
    description:
      'Stake IQ to earn IQ token rewards and NFT raffles. The more IQ staked and longer you stake for the greater the rewards you earn and the chance of winning NFTs.',
  },
}
const Page = () => {
  return <StakePage />
}

export default Page
