'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PaginationProps<T> {
  table: Table<T>
  currentPage: number
  totalPages: number
}

export function TablePagination<T>({
  currentPage,
  totalPages,
}: PaginationProps<T>) {
  const t = useTranslations('hiiq.holders')

  const router = useRouter()
  const searchParams = useSearchParams()

  const maxVisibleButtons = 5

  let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1)
  const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages)

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(endPage - maxVisibleButtons + 1, 1)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-2 w-full">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex-shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden lg:inline ml-1">{t('previous')}</span>
      </Button>

      <div className="hidden lg:flex items-center gap-2">
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <MoreHorizontal className="mx-2" />}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const pageNumber = startPage + index
          return (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          )
        })}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <MoreHorizontal className="mx-2" />}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <div className="lg:hidden flex items-center">
        <span className="text-sm">
          {t('page')} {currentPage} {t('of')} {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex-shrink-0"
      >
        <span className="hidden lg:inline mr-1">{t('next')}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
