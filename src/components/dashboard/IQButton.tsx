import { Box, Button } from '@chakra-ui/react'
import React from 'react'
import { addToken } from '@/utils/add-new-token'
import Image from 'next/image'
import { fetchPrices } from '@/utils/dashboard-utils'

export const IQButton = () => {
  fetchPrices().then((res) => console.log(res))

  return (
    <>
      <Box
        aria-label="IQ Token"
        onClick={() => addToken('IQ')}
        as={Button}
        variant="outline"
        size="sm"
        sx={{
          span: {
            gap: '2',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <Image
          src="/images/braindao-logo-4.svg"
          alt='IQ'
          width={25}
          height={21}
        />
      </Box>
    </>
  )
}
