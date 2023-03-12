import StatsPage from '@/components/client/StatsPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Stats Page',
  description: 'The numbers behind the IQ ecosystem.',
  openGraph: {
    title: 'IQ Stats',
    description: 'The numbers behind the IQ ecosystem.',
  },
}
export const page = () => {
  return <StatsPage />
}
