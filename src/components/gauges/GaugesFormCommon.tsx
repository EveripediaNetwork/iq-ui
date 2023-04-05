import React from 'react'
import { Flex, Text, Button } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

const GaugesFormCommon = ({
  locking,
  handler,
  lockEnd,
}: {
  locking: boolean
  handler: () => void
  lockEnd: string
}) => {
  const { isDisconnected } = useAccount()
  return (
    <>
      {lockEnd ? (
        <Flex mb={3} direction="row" justifyContent="flex-start" w="full">
          <Text fontSize="12px" color="brand.400">
            Your lock end date will be {lockEnd}
          </Text>
        </Flex>
      ) : null}
      <Button
        mb={5}
        w="full"
        isLoading={locking}
        loadingText="Staking..."
        disabled={locking || isDisconnected}
        onClick={handler}
      >
        Stake
      </Button>
    </>
  )
}

export default GaugesFormCommon
