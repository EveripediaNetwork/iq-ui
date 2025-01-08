import VotingPage from '@/components/client/VotingPage'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Voting Page',
  description: 'Follow votes and all related information.',
  openGraph: {
    title: 'IQ Votes',
    description: 'Follow votes and all related information.',
  },
}

const Voting = () => {
  return <VotingPage />
}

export default Voting
