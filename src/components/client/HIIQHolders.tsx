'use client'

import React, { useState } from 'react'
import { columns } from '../dashboard/hiiq-table/columns'
import { DataTable } from '../dashboard/hiiq-table/data-table'
import {
  useGetHIIQHoldersCountQuery,
  useGetHIIQHoldersRankQuery,
} from '@/services/holders'
import { useSearchParams } from 'next/navigation'

const ITEMS_PER_PAGE = 10

export default function HIIQHolders() {
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get('page') || '1')
  const offset = (page - 1) * ITEMS_PER_PAGE
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useGetHIIQHoldersRankQuery({
    limit: ITEMS_PER_PAGE,
    offset: offset,
  })
  const { data: count } = useGetHIIQHoldersCountQuery()

  const filteredData =
    data?.filter((holder) =>
      holder.address.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (isLoading) {
    return <div>Loading...</div>
  }
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1

  return (
    <div className="flex flex-col gap-6 mt-6 lg:mt-0">
      <div className="space-y-1">
        <h1 className="text-base lg:text-2xl font-semibold">
          HiIQ Token Holders
        </h1>
        <p className="text-sm lg:text-base font-medium text-[#475569]">
          View key data and insights on HiIQ token holders.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        totalPages={totalPages}
        currentPage={page}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />
    </div>
  )
}
