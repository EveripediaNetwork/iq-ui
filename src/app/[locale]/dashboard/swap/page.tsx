import React from 'react'
import type { NextPage } from 'next'
import SwapPage from '@/components/client/SwapPage'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async () => {
  const t = await getTranslations('swap.metadata')

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('description'),
    },
  }
}

const Swap: NextPage = () => {
  return <SwapPage />
}

export default Swap
