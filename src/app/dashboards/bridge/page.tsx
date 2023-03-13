import BridgePage from '@/components/client/BridgePage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Bridge Page',
  description:
    'Transfer IQ from EOS to ETH and vice versa using this bridge. Swapping to pIQ is an intermediary step.',
  openGraph: {
    title: 'IQ Bridge',
    description:
      'Transfer IQ from EOS to ETH and vice versa using this bridge. Swapping to pIQ is an intermediary step. ',
  },
}

const Page = () => {
  return <BridgePage/>
}

export default Page
