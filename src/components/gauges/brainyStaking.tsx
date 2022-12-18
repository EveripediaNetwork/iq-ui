import React, { useEffect, useState } from 'react'
import {
  Flex,
  Text,
  Button,
  Divider,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useToast,
} from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useBrainy } from '@/hooks/useBrainy'
import { useAccount } from 'wagmi'
import { Stake } from '@/types/gauge'
import config from '@/config'

const MAX_BRAINIES_ALLOWED_TO_MINT = 2

const BrainyStaking = () => {
  const [lockPeriod, setLockPeriod] = useState(7)
  const [nftId, setNftId] = useState<number | undefined>()
  const [nfts, setNfts] = useState<any>()
  const [locking, setLocking] = useState(false)
  const { isConnected } = useAccount()
  const { isApprovedForAll, approve, getMintedNFTsByUser } = useBrainy()
  const { stake, lockedStakes } = useNFTGauge()
  const toast = useToast()

  const handleLock = async () => {
    if (nftId) {
      setLocking(true)

      if (!isApprovedForAll) {
        const { isError, msg } = await approve()
        toast({
          title: msg,
          position: 'top-right',
          isClosable: true,
          status: isError ? 'error' : 'success',
        })
      }

      const { isError, msg } = await stake(nftId, lockPeriod)

      toast({
        title: msg,
        position: 'top-right',
        isClosable: true,
        status: isError ? 'error' : 'success',
      })

      setLocking(false)
    }
  }

  useEffect(() => {
    const getMintedNfts = async () => {
      const result = await getMintedNFTsByUser()
      if (result) setNfts(result)
    }

    getMintedNfts()
  }, [])

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
          Brainy Staking
        </Text>
        <Divider mb={3} />
        <Input
          disabled={MAX_BRAINIES_ALLOWED_TO_MINT === nfts.length}
          onChange={event => setNftId(Number(event.target.value))}
          type="number"
          min={0}
          mb={3}
          placeholder="NFT ID"
        />
        {nfts && nfts.length > 0 ? (
          <Flex direction="column">
            <Text textAlign="center">Minted NFTs</Text>
            {nfts.map((n: any, index: number) => (
              <Button
                mt={2}
                disabled={config.nftFarmAddress === n.owner}
                key={index}
              >
                NFT ID: {n.tokenId} |{' '}
                {config.nftFarmAddress === n.owner ? 'Locked' : 'Press to lock'}
              </Button>
            ))}
          </Flex>
        ) : null}
        <br />
        <Flex direction="row" mb={4} justifyContent="space-between">
          <Slider
            isDisabled={MAX_BRAINIES_ALLOWED_TO_MINT === nfts.length}
            aria-label="slider-ex-2"
            colorScheme="pink"
            defaultValue={0}
            min={7}
            max={365}
            value={lockPeriod}
            onChange={setLockPeriod}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <NumberInput
            isDisabled={MAX_BRAINIES_ALLOWED_TO_MINT === nfts.length}
            defaultValue={7}
            value={lockPeriod}
            ml={3}
            maxW={20}
            min={7}
            max={365}
            onChange={(_, value: number) => setLockPeriod(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
        <Divider mb={3} />
        <Button
          isLoading={locking}
          loadingText="Staking..."
          disabled={!nftId || locking}
          onClick={handleLock}
        >
          Stake
        </Button>
        {isConnected && lockedStakes && lockedStakes.length > 0 ? (
          <>
            <Divider my={5} />
            <Flex direction="column" justify="center">
              <Text
                fontSize="2xl"
                textDecoration="underline"
                fontWeight="bold"
                textAlign="center"
              >
                Current Stakes
              </Text>
              {lockedStakes.map((s: Stake, index: number) => (
                <Flex
                  key={index}
                  alignItems="center"
                  direction="column"
                  justify="center"
                >
                  <Text fontWeight="bold">Locked on:</Text>
                  <Text>{s.startTimestamp}</Text>
                  <Text fontWeight="bold">Ending on:</Text>
                  <Text>{s.endingTimestamp}</Text>
                  <br />
                </Flex>
              ))}
            </Flex>
          </>
        ) : null}
      </Flex>
    </Flex>
  )
}

export default BrainyStaking
