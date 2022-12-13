import React from 'react'
import { Flex, Text, Button, Box } from '@chakra-ui/react'
// import { useBrainy } from '@/hooks/useBrainy'

const Mint = () => {
  // const {} = useBrainy()

  return (
    <Flex justifyContent="center" direction="column">
      <Box>
        <Text>Current # of brainies minted</Text>
        <Button>Mint</Button>
      </Box>
    </Flex>
  )
}

export default Mint
