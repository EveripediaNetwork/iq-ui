import { Box, Button, Tooltip, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { addToken } from '@/utils/add-new-token'
import Image from 'next/image'
import * as Humanize from 'humanize-plus'
import axios from 'axios'

export const IQButton = () => {
  const [price, setPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await axios.get('/api/cmc-token-details', {
          params: { tokenName: 'IQ' },
        })
        const { data } = res.data.response
        const tokenPrice = data.IQ.quote.USD.price
        setPrice(tokenPrice)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsLoading(true)
      }
    })()
  })
  return (
    <>
      <Button
        aria-label="IQ Token"
        onClick={() => addToken('IQ')}
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
          <Box as="span">
            <Image
              src="/images/braindao-logo-4.svg"
              alt="IQ"
              width={25}
              height={21}
            />
            {isLoading ? (
              <Spinner size="xs" />
            ) : (
              <Box>{`${Humanize.formatNumber(price, 4)}`}</Box>
            )}
          </Box>
        </Tooltip>
      </Button>
    </>
  )
}
