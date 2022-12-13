import React, { useState } from 'react'
import { Flex, Text, Button, Divider, useToast } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useBrainy } from '@/hooks/useBrainy'

const Mint = () => {
  const [isMinting, setIsMinting] = useState(false)
  const { isDisconnected } = useAccount()
  const { mint, balance, tokensMinted, maxPerWallet, canMint } = useBrainy()
  const toast = useToast()

  const handleMint = async () => {
    setIsMinting(true)

    const { isError, msg } = await mint()

    toast({
      title: msg,
      position: 'top-right',
      isClosable: true,
      status: isError ? 'error' : 'success',
    })

    setIsMinting(false)
  }

  return (
    <Flex justifyContent="center" alignItems="center" direction="column">
      <Flex
        rounded="lg"
        direction="column"
        justifyContent="center"
        p="5"
        border="lightgray solid 1px"
        w="350px"
        maxW="350px"
      >
        <Text textAlign="center" fontSize="2xl" fontWeight="bold">
          Brainies Minting
        </Text>
        <Divider mb={3} />
        {isDisconnected ? (
          <Text>Disconnected</Text>
        ) : (
          <>
            <Text>
              {balance
                ? `Your Brainies balance: ${balance}`
                : 'No Brainy minted so far'}{' '}
            </Text>
            <Text>Already Minted: {tokensMinted}</Text>
          </>
        )}
        <Text>Max issuance per wallet: {maxPerWallet}</Text>
        <Divider my={3} />
        <Button
          isLoading={isMinting}
          loadingText="Minting..."
          disabled={!canMint || isDisconnected || isMinting}
          onClick={handleMint}
        >
          Mint
        </Button>
      </Flex>
    </Flex>
  )
}

export default Mint
