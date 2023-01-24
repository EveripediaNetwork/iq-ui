import React, { useState } from 'react'
import {
  Flex,
  Text,
  Button,
  useToast,
  Image,
  Input,
  IconButton,
  Box,
  SimpleGrid,
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { RiSubtractLine, RiAddLine } from 'react-icons/ri'
import { useBrainy } from '@/hooks/useBrainy'
import { BRAINIES_MAX_SUPPLY, MAX_MINT_AMOUNT } from '@/data/GaugesConstants'
import { SALESTATUS } from '@/types/gauge'

enum BTNACTIONS {
  DECREMENT = 1,
  INCREMENT = 2,
}

const Mint = () => {
  const [isMinting, setIsMinting] = useState(false)
  const [amountToMint, setAmountToMint] = useState<number>(0)
  const { isDisconnected } = useAccount()
  const { mint, tokensMinted, maxPerWallet, canMint, totalSupply, status } =
    useBrainy()
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

  const getSaleStatus = () => {
    if (status === SALESTATUS.PAUSED) return 'Paused'
    if (status === SALESTATUS.WHITELIST) return 'Whitelist'
    return 'Open'
  }

  const handleActionBtns = (action: BTNACTIONS) => {
    if (action === BTNACTIONS.DECREMENT) setAmountToMint(amountToMint - 1)
    if (action === BTNACTIONS.INCREMENT) setAmountToMint(amountToMint + 1)
  }

  return (
    <Flex
      justifyContent="center"
      alignItems={{ base: 'center', lg: 'flex-start' }}
      direction="column"
      ml="-4"
    >
      <Text my={6} textAlign="left" fontSize="2xl" fontWeight="semibold">
        Mint a Brainy
      </Text>
      <Box
        rounded="lg"
        p="4"
        border="solid 1px "
        borderColor="divider"
        w={{ base: 350, lg: 724 }}
      >
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="6">
          <Image
            borderRadius="12px"
            fallbackSrc="https://via.placeholder.com/350"
          />
          <Box mt="6">
            <Flex mb={6} direction="row" justifyContent="space-between">
              <Text fontSize="sm" fontWeight="bold">
                Supply
              </Text>{' '}
              <Text fontSize="sm">
                {totalSupply}/{BRAINIES_MAX_SUPPLY}
              </Text>
            </Flex>
            <Flex mb={6} direction="row" justifyContent="space-between">
              <Text fontSize="sm" fontWeight="bold">
                Sale Status
              </Text>{' '}
              <Text fontSize="sm">{getSaleStatus()}</Text>
            </Flex>
            <Flex mb={6} direction="row" justifyContent="space-between">
              <Text fontSize="sm" fontWeight="bold">
                Already minted
              </Text>{' '}
              <Text fontSize="sm">{tokensMinted || 'false'}</Text>
            </Flex>
            <Flex mb={6} direction="row" justifyContent="space-between">
              <IconButton
                disabled={amountToMint === 0}
                fontWeight="bold"
                color="brand.500"
                variant="outline"
                aria-label="Decrement"
                icon={<RiSubtractLine />}
                onClick={() => handleActionBtns(BTNACTIONS.DECREMENT)}
              />
              <Input
                onChange={event => setAmountToMint(Number(event.target.value))}
                value={amountToMint}
                type="number"
                disabled={Number(tokensMinted) === MAX_MINT_AMOUNT}
                max="2"
                min={0}
                textAlign="center"
                placeholder="1"
                w="150px"
              />
              <IconButton
                disabled={
                  amountToMint === MAX_MINT_AMOUNT ||
                  Number(tokensMinted) === MAX_MINT_AMOUNT
                }
                fontWeight="extrabold"
                color="brand.500"
                variant="outline"
                aria-label="Increment"
                icon={<RiAddLine />}
                onClick={() => handleActionBtns(BTNACTIONS.INCREMENT)}
              />
            </Flex>
            <Text mb={5} fontSize="sm" fontWeight="bold">
              Max issuance: {maxPerWallet} NFT mints/per wallet
            </Text>
            <Button
              isLoading={isMinting}
              loadingText="Minting..."
              disabled={!canMint || isDisconnected || isMinting}
              onClick={handleMint}
              w="full"
            >
              Mint
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  )
}

export default Mint
