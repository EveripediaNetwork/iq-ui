'use client'

import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RiLoaderLine } from 'react-icons/ri'
import { Badge } from '@/components/ui/badge'
import { useGetHIIQHoldersCountQuery } from '@/services/holders'
import { TablePagination } from './pagination'
import { useTranslations } from 'next-intl'
import { getColumns } from './columns'

interface DataTableProps<TData, TValue> {
  data: TData[]
  totalPages: number
  currentPage: number
  onSearch: (value: string) => void
  searchTerm: string
  isSearching: boolean
}

export function DataTable<TData, TValue>({
  data,
  totalPages,
  currentPage,
  onSearch,
  searchTerm,
  isSearching,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const t = useTranslations('hiiq')
  const columns = getColumns(t)

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const { data: count, isLoading } = useGetHIIQHoldersCountQuery()

  return (
    <div className="rounded-xl border mb-20">
      <div className="border-b p-4 flex flex-row gap-4 items-center">
        <h1>{t('tabs.hiiqHoldersLabel')}</h1>
        <Badge
          className="bg-brand-50 text-brand-500 dark:text-brand-800 border-0 py-1 px-1.5"
          variant="outline"
        >
          {isLoading ? (
            <RiLoaderLine className="animate-spin mr-2" size={18} />
          ) : (
            count ?? 0
          )}{' '}
          {t('holders.tokenHolders')}
        </Badge>
      </div>
      <div className="flex items-center justify-end p-4">
        <Input
          placeholder={t('holders.searchPlaceholder')}
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          className="max-w-sm bg-transparent"
        />
      </div>
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800 border-t">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isSearching ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <RiLoaderLine className="animate-spin mr-2" size={18} />
                  {t('holders.hiiqTableStatus.searching')}
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('holders.hiiqTableStatus.noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 p-4">
        <TablePagination
          table={table}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </div>
  )
}
