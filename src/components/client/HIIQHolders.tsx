'use client'

import React, { useState, useCallback } from 'react'
import { columns } from '../dashboard/hiiq-table/columns'
import { DataTable } from '../dashboard/hiiq-table/data-table'
import {
  useGetHIIQHoldersCountQuery,
  useGetHIIQHoldersRankQuery,
  useSearchHiIQHoldersByAddressMutation,
} from '@/services/holders'
import { useSearchParams } from 'next/navigation'

const ITEMS_PER_PAGE = 10

export default function HIIQHolders() {
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get('page') || '1')
  const offset = (page - 1) * ITEMS_PER_PAGE
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [searchHolders] = useSearchHiIQHoldersByAddressMutation()

  const { data, isLoading } = useGetHIIQHoldersRankQuery({
    limit: ITEMS_PER_PAGE,
    offset: offset,
  })
  const { data: count } = useGetHIIQHoldersCountQuery()

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchTerm(value)
      setIsSearching(true)

      try {
        if (!value.trim()) {
          setSearchResults([])
          setIsSearching(false)
          return
        }

        if (value.trim().length >= 3) {
          const results = await searchHolders({
            address: value.toLowerCase(),
          }).unwrap()

          if (results) {
            const searchData = Array.isArray(results) ? results : [results]

            const formattedResults = searchData.map((item) => ({
              address: item.address,
              tokens: item.tokens,
              updated: item.updated,
            }))

            setSearchResults(formattedResults)
          } else {
            setSearchResults([])
          }
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [searchHolders],
  )

  const displayData = searchTerm ? searchResults : data || []

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
        <p className="text-sm lg:text-base font-medium text-[#475569] dark:text-[#D2D2D2]">
          View key data and insights on HiIQ token holders.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={displayData}
        totalPages={totalPages}
        currentPage={page}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        isSearching={isSearching}
      />
    </div>
  )
}
