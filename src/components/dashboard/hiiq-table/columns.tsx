'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { RiArrowDownSFill, RiCheckFill, RiFileCopyLine } from 'react-icons/ri'
import { getShortenAddress } from '@/lib/helpers/getShortenAddress'
import { useState } from 'react'
import { Link } from '@/i18n/routing'

export type HIIQHoldersProps = {
  address: string
  tokens: string
  updated: number
}

export const getColumns = (
  t: (key: string) => string,
): ColumnDef<HIIQHoldersProps>[] => [
  {
    accessorKey: 'rank',
    header: t('holders.hiiqTableHeader1'),
    cell: ({ row }) => {
      const ITEMS_PER_PAGE = 10
      const page = Math.max(
        Number(new URLSearchParams(window.location.search).get('page') || '1'),
        1,
      )
      const rank = row.index + 1 + (page - 1) * ITEMS_PER_PAGE
      return <div>{rank}</div>
    },
  },
  {
    accessorKey: 'address',
    header: t('holders.hiiqTableHeader2'),
    cell: ({ row }) => {
      const [isCopied, setIsCopied] = useState(false)

      const handleCopy = () => {
        const address = row.getValue('address')
        if (typeof address === 'string') {
          navigator.clipboard.writeText(address)
          setIsCopied(true)
          setTimeout(() => {
            setIsCopied(false)
          }, 3000)
        }
      }

      const address = row.getValue('address')
      const shortenedAddress =
        typeof address === 'string' ? getShortenAddress(address) : ''

      return (
        <div className="flex flex-row items-center gap-2">
          <Link
            target="_blank"
            rel="noreferrer"
            href={`https://ethplorer.io/es/address/${address}#pageSize=100&pageTab=transfers`}
            className="text-brand-500 dark:text-brand-800 hover:underline"
          >
            {shortenedAddress}
          </Link>
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
          onClick={() => column.toggleSorting()}
        >
          {t('holders.hiiqTableHeader3')}
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
    sortingFn: (rowA, rowB) => {
      return Number(rowA.original.tokens) - Number(rowB.original.tokens)
    },
  },
  {
    accessorKey: 'updated',
    header: t('holders.hiiqTableHeader4'),
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-1 font-medium">
          <span>
            {new Date(row.getValue('updated')).toLocaleDateString('en-GB', {
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
