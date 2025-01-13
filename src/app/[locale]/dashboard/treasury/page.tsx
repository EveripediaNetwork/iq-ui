import TreasuryPage from '@/components/client/TreasuryPage'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export const generateMetadata = async () => {
  const t = await getTranslations('treasury.metadata')

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('description'),
    },
  }
}

const Treasury = () => {
  return <TreasuryPage />
}

export default Treasury
