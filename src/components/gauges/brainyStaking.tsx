import React, { useEffect, useState } from 'react'
import {
  Flex,
  useToast,
  Icon,
  Image,
  Box,
  Text,
  Input,
  InputLeftAddon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  InputGroup,
  SliderThumb,
  InputRightAddon,
  Button,
  SimpleGrid,
} from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useBrainy } from '@/hooks/useBrainy'
import { useAccount } from 'wagmi'
import { RiQuestionLine } from 'react-icons/ri'
import BrainiesStakes from './brainiesStakes'

const MAX_BRAINIES_ALLOWED_TO_MINT = 2

type TokenIdType = {
  tokenId: number
}

const BrainyStaking = () => {
  const [lockPeriod, setLockPeriod] = useState(7)
  const [nftId, setNftId] = useState<number | undefined>()
  const [lockEnd, setLockEnd] = useState<string>()
  const [nfts, setNfts] = useState<Array<TokenIdType>>()
  const [nftURI, setNftURI] = useState('')
  const [locking, setLocking] = useState(false)
  const { isConnected, isDisconnected } = useAccount()
  const { approve, getMintedNFTsByUser, isTheOwner, tokenURI } = useBrainy()
  const { stake } = useNFTGauge()
  const toast = useToast()

  const getMintedNfts = async () => {
    const result = await getMintedNFTsByUser()
    if (!result?.isError) setNfts(result?.nfts)
  }

  const handleLock = async () => {
    if (nftId) {
      setLocking(true)
      const isTheCurrentOwner = await isTheOwner(nftId)

      if (isTheCurrentOwner) {
        const { isError, msg } = await approve(nftId)
        toast({
          title: msg,
          position: 'top-right',
          isClosable: true,
          status: isError ? 'error' : 'success',
        })
      }

      const { isError, msg } = await stake(Number(nftId), lockPeriod)

      toast({
        title: msg,
        position: 'top-right',
        isClosable: true,
        status: isError ? 'error' : 'success',
      })

      getMintedNfts()

      setLocking(false)
    }
  }

  const calculateLockEnd = (days: number) => {
    const now = new Date()
    now.setSeconds(days * 86400)

    setLockEnd(now.toUTCString())
  }

  const handleIncrementDecrement = (value: number) => {
    if (value < 7 || value > 365) return

    setLockPeriod(value)
    calculateLockEnd(value)
  }

  const handleOnInputNftChange = async (tokenId: number) => {
    setNftId(tokenId)
    const { isError, tokenURI: URI } = await tokenURI(tokenId)

    if (!isError) setNftURI(URI)
  }

  const disableControls = () => {
    if (!nfts) return true

    if (isDisconnected) return true

    if (locking) return true

    return MAX_BRAINIES_ALLOWED_TO_MINT === nfts.length
  }

  useEffect(() => {
    if (isConnected) getMintedNfts()
    else setNfts([])
  }, [isConnected])

  useEffect(() => {
    getMintedNfts()
  }, [])

  return (
    <SimpleGrid
      justifyContent="center"
      w="full"
      columns={{ base: 1, lg: 2 }}
      spacing={{ base: 8, lg: 16, '2xl': 4 }}
      my={7}
    >
      <Flex
        mb={3}
        w={[320, 430, 500]}
        rounded="lg"
        alignItems="center"
        direction="column"
        border="solid 1px "
        borderColor="divider"
        px={10}
        mx={{ base: 'auto', lg: '10' }}
      >
        <Flex
          w="100%"
          direction="row"
          py={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={{ md: 'xl' }} fontWeight="bold">
            Brainy Staking
          </Text>
        </Flex>
        <Flex
          pt={2}
          mb={5}
          alignItems="center"
          direction="column"
          w={[250, 370]}
          background="hoverBg"
          borderRadius={8}
          border="solid 1px "
          borderColor="divider"
          px={2}
        >
          <Image
            src={nftURI}
            borderRadius="12px"
            fallbackSrc="https://via.placeholder.com/350"
          />
          <Box w="full" px={{ base: 0 }} py={2}>
            <Input
              onChange={event =>
                handleOnInputNftChange(Number(event.target.value))
              }
              px={[3, 4]}
              backgroundColor="subMenuBg"
              placeholder="NFT ID: #0000"
              w="full"
              border="none"
            />
          </Box>
        </Flex>
        <Flex
          px={4}
          py={5}
          mb={3}
          borderRadius="6px"
          border="solid 1px "
          borderColor="divider"
          direction="column"
          justifyContent="space-around"
          w="full"
        >
          <Text fontSize="xs">Lock period (days)</Text>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            w="100%"
          >
            <Slider
              isDisabled={disableControls()}
              aria-label="slider-ex-2"
              colorScheme="pink"
              defaultValue={0}
              min={7}
              ml={2}
              max={365}
              value={lockPeriod}
              onChange={setLockPeriod}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Flex mt={{ base: '3', md: '0' }} ml={4} align="end">
              <InputGroup bg="lightCard" size="xs">
                <InputLeftAddon
                  cursor="pointer"
                  onClick={() => handleIncrementDecrement(lockPeriod - 1)}
                  bg="lightCard"
                  color="grayText4"
                >
                  <Text>-</Text>
                </InputLeftAddon>
                <Input
                  max={365}
                  value={lockPeriod}
                  w={{ base: 'full', md: '10' }}
                  onChange={e =>
                    handleIncrementDecrement(Number(e.target.value))
                  }
                  color="grayText4"
                  disabled={!isConnected}
                  bg="lightCard"
                  textAlign="center"
                />
                <InputRightAddon
                  cursor="pointer"
                  color="grayText4"
                  onClick={() => handleIncrementDecrement(lockPeriod + 1)}
                  bg="lightCard"
                >
                  <Text>+</Text>
                </InputRightAddon>
              </InputGroup>
            </Flex>
          </Flex>
        </Flex>
        {lockEnd ? (
          <Flex mb={3} direction="row" justifyContent="flex-start" w="full">
            <Icon
              color="brandText"
              cursor="pointer"
              // onClick={() => setOpenStakingInfo(true)}
              fontSize={16}
              as={RiQuestionLine}
            />
            <Text ml={2} fontSize="12px" color="brand.400">
              Your lock end date will be {lockEnd}
            </Text>
          </Flex>
        ) : null}
        <Button
          mb={5}
          w="full"
          isLoading={locking}
          loadingText="Staking..."
          disabled={!nftId || locking || isDisconnected}
          onClick={handleLock}
        >
          Stake
        </Button>
      </Flex>
      <BrainiesStakes />
    </SimpleGrid>
  )
}

export default BrainyStaking
