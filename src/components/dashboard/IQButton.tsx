import { Box, Button, Tooltip, Spinner, ButtonProps } from '@chakra-ui/react'
import React from 'react'
import { addToken } from '@/utils/add-new-token'
import Image from 'next/image'
import * as Humanize from 'humanize-plus'
import { useGetIqPriceQuery } from '@/services/iqPrice'

export const IQButton = (props: ButtonProps) => {
  const SIG_FIGS = 4
  const { data, isLoading, error } = useGetIqPriceQuery('IQ')
  const iqPrice = data?.response?.[0]?.quote?.USD?.price || 0.0
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
              src="/svgs/braindao-logo-4.svg"
              alt="IQ"
              width={25}
              height="21"
            />
            {error ? (
              <>Oh no, there was an error</>
            ) : isLoading ? (
              <Spinner size="xs" color="brandText" />
            ) : iqPrice ? (
              <Box
                fontSize={{ base: 'xs', md: 'inherit' }}
              >{`${Humanize.formatNumber(iqPrice, SIG_FIGS)}`}</Box>
            ) : null}
          </Box>
        </Tooltip>
      </Button>
    </>
  )
}
