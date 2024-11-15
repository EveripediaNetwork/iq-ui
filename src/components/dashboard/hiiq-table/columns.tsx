'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { RiArrowDownSFill, RiFileCopyLine } from 'react-icons/ri'
import { getShortenAddress } from '@/lib/helpers/getShortenAddress'

export type HIIQHoldersProps = {
  address: string
  tokens: string
  percentage?: string
  updated: number
  created: number
}

export const columns: ColumnDef<HIIQHoldersProps>[] = [
  {
    accessorKey: 'rank',
    header: 'Rank',
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <span className="text-brand-500 dark:text-brand-800">
            {getShortenAddress(row.getValue('address'))}
          </span>
          <RiFileCopyLine
            size={18}
            className="opacity-40 hover:opacity-70 cursor-pointer"
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'tokens',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          HiIQ Balance
          <RiArrowDownSFill className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-1 font-medium">
          <span>{Number(row.getValue('tokens')).toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'percentage',
    header: 'Percentage',
  },
  {
    accessorKey: 'update',
    header: 'Last Updated',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-1 font-medium">
          Block{' '}
          <span className="text-brand-500 dark:text-brand-800">
            {row.getValue('update')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'dateStaked',
    header: 'Date Staked',
  },
]
