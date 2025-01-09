import VotingPage from '@/components/client/VotingPage'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export const generateMetadata = async () => {
  const t = await getTranslations('voting.metadata')

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('description'),
    },
  }
}
const Voting = () => {
  return <VotingPage />
}

export default Voting
