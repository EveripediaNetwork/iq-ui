import StatsPage from '@/components/client/StatsPage'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export const generateMetadata = async () => {
  const t = await getTranslations('stats.metadata')

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('description'),
    },
  }
}
const Page = () => {
  return <StatsPage />
}

export default Page
