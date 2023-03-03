import React from 'react'
import { Box } from '@chakra-ui/react'

const PieWrapper = ({ children }: { children: JSX.Element }) => {
  return (
    <Box
      display="flex"
      mt={{ lg: -2 }}
      justifyContent="center"
      alignItems="center"
    >
        {children}
    </Box>
  )
}

export default PieWrapper
