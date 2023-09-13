import { Box, Button, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { addToken } from '@/utils/add-new-token'
import Image from 'next/image'
import * as Humanize from 'humanize-plus'

export const IQButton = () => {
  const [price, setPrice] = useState(0)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=everipedia&vs_currencies=usd',
          {
            headers: {
              accept: 'application/json',
            },
          },
        )
        const data = await res.json()
        console.log(data)
        setPrice(data.everipedia.usd)
      } catch (error) {
        console.error(error)
      }
    })()
  })
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
