import { Box, Button, Tooltip } from '@chakra-ui/react'
import React, { useState } from 'react'
import { addToken } from '@/utils/add-new-token'
import Image from 'next/image'
import { fetchPrices } from '@/utils/dashboard-utils'
import * as Humanize from 'humanize-plus'

export const IQButton = () => {
  const [price, setPrice] = useState(0)
  fetchPrices().then((res) => setPrice(res[0].prices?.[0][1]))
  return (
    <>
      <Box
        aria-label="IQ Token"
        onClick={() => addToken('IQ')}
        as={Button}
        variant="outline"
        size="sm"
        fontWeight="500"
        sx={{
          span: {
            gap: '2',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <Tooltip
          hasArrow
          label={'Add IQ to Metamask'}
          placement="bottom"
          color="grayText4"
          rounded="lg"
          bg="tooltipBg"
        >
          <Box as='span'>
            <Image
              src="/images/braindao-logo-4.svg"
              alt='IQ'
              width={25}
              height={21}
            />
            <Box>{`${Humanize.formatNumber(price, 4)}`}</Box>
          </Box>
        </Tooltip>
      </Box>
    </>
  )
}
