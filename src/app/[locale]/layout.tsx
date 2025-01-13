import 'regenerator-runtime/runtime'
import React from 'react'
import AppProviders from '@/components/client/AppProviders'
import ColorMode from '@/components/chakra/ColorMode'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

const LocaleLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ColorMode />
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  )
}

export default LocaleLayout
