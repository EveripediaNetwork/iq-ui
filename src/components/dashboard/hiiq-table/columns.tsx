'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { RiArrowDownSFill, RiFileCopyLine } from 'react-icons/ri'

export type Payment = {
  address: string
  hiiq: string
  percentage: string
  update: number
  dateStaked: string
}

export const columns: ColumnDef<Payment>[] = [
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
            {row.getValue('address')}
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
    accessorKey: 'hiiq',
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
