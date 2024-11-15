'use client'

import React from 'react'
import { columns } from '../dashboard/hiiq-table/columns'
import { DataTable } from '../dashboard/hiiq-table/data-table'
import { useGetHIIQHoldersRankQuery } from '@/services/holders'

export default function HIIQHolders() {
  const { data, isLoading } = useGetHIIQHoldersRankQuery({
    limit: 10,
    offset: 0,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  console.log(data)

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">HiIQ Token Holders</h1>
        <p className="text-base font-medium text-[#475569]">
          View key data and insights on HiIQ token holders.
        </p>
      </div>
      <DataTable columns={columns} data={data || []} />
    </div>
  )
}
