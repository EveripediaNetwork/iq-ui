import GaugesPage from '@/components/client/GaugesPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Gauges Page',
  description: 'Vote for gauges with your weight to earn rewards',
  openGraph: {
    title: 'IQ Gauges',
    description: 'Vote for gauges with your weight to earn rewards',
  },
}
const Page = () => {
  return <GaugesPage />
}

export default Page
