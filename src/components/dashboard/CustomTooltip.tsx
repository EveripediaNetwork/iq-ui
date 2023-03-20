import React from 'react'
import { Dict } from '@chakra-ui/utils'

const CustomTooltip = ({ active, payload }: Dict) => {
  if (active && payload && payload.length) {
    return (
      <p>
        <b>Price:</b> {`$${payload[0].value.toFixed(6)}`}
      </p>
    )
  }

  return null
}

export default CustomTooltip
