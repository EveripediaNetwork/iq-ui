'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

const tabs = [
  {
    label: 'stakeLabel',
    id: 'stake',
  },
  {
    label: 'hiiqHoldersLabel',
    id: 'hiiq-holders',
  },
]

export default function layout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const t = useTranslations('hiiq.tabs')

  return (
    <div className="flex flex-col gap-6 mt-6 relative">
      <div className="flex gap-4 flex-row items-center justify-center">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/dashboard/${tab.id}`}
            className={cn(
              'pb-2 border-b-4 px-2',
              path?.includes(tab.id)
                ? 'border-brand-500 dark:border-brand-800'
                : ' border-none',
            )}
          >
            {t(tab.label)}
          </Link>
        ))}
      </div>
      <div className="absolute h-[0.5px] w-[calc(100vw)] -ml-[calc(50vw-50%)] border-b border-gray-300 dark:border-gray-600 top-9 -z-40" />
      <div>{children}</div>
    </div>
  )
}
