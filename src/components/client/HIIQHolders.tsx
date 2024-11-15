import React from 'react'
import { columns, Payment } from '../dashboard/hiiq-table/columns'
import { DataTable } from '../dashboard/hiiq-table/data-table'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      address: '0x23fd433b...1a6d8da78',
      hiiq: '784.135.650,2173665',
      percentage: '15.95%',
      update: 21079706,
      dateStaked: '22 Feb 2021',
    },
    {
      address: '0xecac3e37...7E7adab3a',
      hiiq: '322.646.434,22737336',
      percentage: '6.56%',
      update: 51179600,
      dateStaked: '20 July 2018',
    },
    {
      address: '0xfc762d68...7aeb2bd5c',
      hiiq: '229.625.393,35384727',
      percentage: '4.67%',
      update: 75320645,
      dateStaked: '24 Jan 2022',
    },
    {
      address: '0xb55794c3be...67837c3',
      hiiq: '201.009.577,48953065',
      percentage: '4.09%',
      update: 34079870,
      dateStaked: '26 Feb 2023',
    },
  ]
}

export default async function HIIQHolders() {
  const data = await getData()

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">HiIQ Token Holders</h1>
        <p className="text-base font-medium text-[#475569]">
          View key data and insights on HiIQ token holders.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
