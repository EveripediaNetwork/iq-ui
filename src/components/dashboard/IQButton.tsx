import { Box, Button, Tooltip, Spinner, ButtonProps, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { addToken } from '@/utils/add-new-token'
import Image from 'next/image'
import * as Humanize from 'humanize-plus'
import axios from 'axios'

export const IQButton = (props: ButtonProps) => {
  const sigFigs = useBreakpointValue({ base: 4, md: 4 })
  const [price, setPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/coins/everipedia/market_chart?vs_currency=usd&days=1',
        )
        const { prices } = res.data
        setPrice(prices[prices.length - 1][1])
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsLoading(true)
      }
    })()
  }, [])
  return (
    <>
      <Button
        {...props}
        aria-label="IQ Token"
        onClick={() => addToken('IQ')}
        variant="outline"
        size="sm"
        fontWeight="500"
        overflow="hidden"
        sx={{
          span: {
            gap: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              <Spinner size="xs" color="brandText" />
            ) : (
              <Box fontSize={{base: "xs", md: 'inherit'}}>{`${Humanize.formatNumber(price, sigFigs)}`}</Box>
            )}
          </Box>
        </Tooltip>
      </Button>
    </>
  )
}
