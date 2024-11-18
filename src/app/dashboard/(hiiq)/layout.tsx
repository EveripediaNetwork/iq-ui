import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Tabs defaultValue="stake" className="">
      <TabsList className="flex items-center py-4">
        <TabsTrigger value="stake">
          <Link href="/dashboard/stake">Stake</Link>
        </TabsTrigger>
        <TabsTrigger value="password">
          <Link href="/dashboard/hiiq-holders">HIIQ Holders</Link>
        </TabsTrigger>
      </TabsList>
      {/* <div className="w-full h-[0.5px] bg-gray200 dark:bg-gray900 absolute left-0  right-0 -z-50" /> */}
      <div>{children}</div>
    </Tabs>
  )
}
