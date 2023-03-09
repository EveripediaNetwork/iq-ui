import React from 'react'
import type { Metadata, NextPage } from 'next'
import SwapPage from '@/components/client/SwapPage'

export const metadata: Metadata = {
    title: "Swap Page",
    description:
      'Get involved in the IQ Ecosystem and swap the IQ token easily across different exchange platforms.',
    openGraph:{
        title: 'IQ Swap platforms',
        description:
          'Get involved in the IQ Ecosystem and swap the IQ token easily across different exchange platforms.',
    },
  }

const Swap: NextPage = () => {
  return (
    <SwapPage/>
  )
}

export default Swap
