'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { RiArrowDownSFill, RiCheckFill, RiFileCopyLine } from 'react-icons/ri'
import { getShortenAddress } from '@/lib/helpers/getShortenAddress'
import { useState } from 'react'

export type HIIQHoldersProps = {
  address: string
  tokens: string
  created: number
}

export const columns: ColumnDef<HIIQHoldersProps>[] = [
  {
    accessorKey: 'rank',
    header: 'Rank',
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const [isCopied, setIsCopied] = useState(false)

      const handleCopy = () => {
        navigator.clipboard.writeText(row.getValue('address'))
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      }

      return (
        <div className="flex flex-row items-center gap-2">
          <span className="text-brand-500 dark:text-brand-800">
            {getShortenAddress(row.getValue('address'))}
          </span>
          {isCopied ? (
            <RiCheckFill size={18} className="text-green-500" />
          ) : (
            <RiFileCopyLine
              size={18}
              className="opacity-40 hover:opacity-70 cursor-pointer"
              onClick={handleCopy}
            />
          )}
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
    accessorKey: 'created',
    header: 'Date Staked',
    cell: ({ row }) => {
      const dateString = row.getValue('created')
      const date = new Date(dateString as string)

      console.log(date)
      return (
        <div className="flex flex-row items-center gap-1 font-medium">
          <span>
            {new Date(row.getValue('created')).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      )
    },
  },
]
