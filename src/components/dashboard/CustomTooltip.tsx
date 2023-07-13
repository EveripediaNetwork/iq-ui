import React from 'react'
import { Dict } from '@chakra-ui/utils'
import { Box, Text } from '@chakra-ui/layout'
import * as Humanize from 'humanize-plus'

const CustomTooltip = ({
  active,
  payload,
  isPrice = true,
  isTreasuryPage = false,
}: Dict) => {
  if (active && payload && payload.length) {
    return (
      <Box bg="toolTipBg" p={2} rounded="lg">
        {isPrice ? (
          <>
            <b>Price:</b> {`$${payload[0].value.toFixed(6)}`}
          </>
        ) : (
          <>
            <Text fontWeight="bold" fontSize="sm">
              {isTreasuryPage ? 'Total tokens:' : 'IQ Staked:'}
              {isTreasuryPage
                ? `$ ${Humanize.formatNumber(payload[0].payload.amt, 2)}`
                : `${Humanize.formatNumber(payload[0].payload.amt, 2)} IQ`}
            </Text>

            <Text fontSize="sm">{payload[0].payload.name}</Text>
          </>
        )}
      </Box>
    )
  }

  return null
}

export default CustomTooltip
