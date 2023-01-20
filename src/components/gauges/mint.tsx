import React, { useState } from 'react'
import {
  Flex,
  Text,
  Button,
  Divider,
  useToast,
  Image,
  Input,
  IconButton,
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
    <Flex justifyContent="center" alignItems="left" direction="column">
      <Text textAlign="left" fontSize="2xl" fontWeight="bold">
        Mint a Brainie
      </Text>
      <Flex
        rounded="lg"
        direction="row"
        justify="center"
        justifyContent={['center', 'center', 'space-between']}
        alignItems="center"
        flexWrap="wrap"
        p="5"
        border="lightgray solid 1px"
        w={[350, 450, 724]}
        // maxW="350px"
      >
        <Image
          borderRadius="12px"
          fallbackSrc="https://via.placeholder.com/300"
        />
        <Flex direction="column" w="276">
          <Flex mb="24px" direction="row" justifyContent="space-between">
            <Text>Supply</Text>{' '}
            <Text>
              {totalSupply}/{BRAINIES_MAX_SUPPLY}
            </Text>
          </Flex>
          <Flex mb="24px" direction="row" justifyContent="space-between">
            <Text>Sale Status</Text> <Text>{getSaleStatus()}</Text>
          </Flex>
          <Flex mb="24px" direction="row" justifyContent="space-between">
            <Text>Already minted</Text> <Text>{tokensMinted}</Text>
          </Flex>
          {/* <Flex mb="24px" direction="row" justifyContent="space-between">
            <Text>Price</Text> <Text>0.2ETH</Text>
          </Flex> */}
          <Flex mb="24px" direction="row" justifyContent="space-between">
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
          <Text>Max issuance: {maxPerWallet}NFT mints/per wallet</Text>
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
    </Flex>
  )
}

export default Mint
