'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  {
    label: 'Stake',
    id: 'stake',
  },
  {
    label: 'HIIQ Holders',
    id: 'hiiq-holders',
  },
]

export default function layout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

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
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="absolute h-[0.5px] w-[calc(100vw)] -ml-[calc(50vw-50%)] border-b top-9 -z-10" />
      <div>{children}</div>
    </div>
  )
}
