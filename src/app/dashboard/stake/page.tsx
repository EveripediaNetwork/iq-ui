import HIIQHolders from '@/components/client/HIIQHolders'
import StakePage from '@/components/client/StakePage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Stake Page',
  description:
    'Stake IQ to earn IQ token rewards and NFT raffles. The more IQ staked and longer you stake for the greater the rewards you earn and the chance of winning NFTs.',
  openGraph: {
    title: 'IQ Stake',
    description:
      'Stake IQ to earn IQ token rewards and NFT raffles. The more IQ staked and longer you stake for the greater the rewards you earn and the chance of winning NFTs.',
  },
}

const Page = () => {
  return (
    <Tabs defaultValue="stake">
      <TabsList className="flex items-center">
        <TabsTrigger value="stake">Stake</TabsTrigger>
        <TabsTrigger value="password">HIIQ Holders</TabsTrigger>
      </TabsList>
      <TabsContent value="stake">
        <StakePage />
      </TabsContent>
      <TabsContent value="password">
        {/* @ts-expect-error Server Component */}
        <HIIQHolders />
      </TabsContent>
    </Tabs>
  )
}

export default Page
