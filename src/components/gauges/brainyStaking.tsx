import React, { useEffect, useState } from 'react'
import {
  Flex,
  useToast,
  Image,
  Box,
  Text,
  Input,
  Button,
  SimpleGrid,
  Select,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useBrainy } from '@/hooks/useBrainy'
import { useAccount } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setCurrentStaking } from '@/store/slices/nftFarm-slice'
import BrainiesStakes from './brainiesStakes'
import StakingInfo from '../lock/StakingInfo'
import StakeInfoIcon from '../elements/stakeCommon/StakeInfoIcon'
import StakingLockPeriod from './stakingLockPeriod'

type TokenIdType = {
  tokenId: number
}

const BrainyStaking = () => {
  const [lockPeriod, setLockPeriod] = useState(7)
  const [nftId, setNftId] = useState<number | undefined>()
  const [lockEnd, setLockEnd] = useState<string>()
  const [, setNfts] = useState<Array<TokenIdType>>()
  const [openStakingInfo, setOpenStakingInfo] = useState(false)
  const [nftURI, setNftURI] = useState('')
  const [locking, setLocking] = useState(false)
  const { isConnected, isDisconnected } = useAccount()
  const { approve, getMintedNFTsByUser, isTheOwner, tokenURI } = useBrainy()
  const { stake, refetchTotalLiquidityLocked } = useNFTGauge()
  const toast = useToast()
  const dispatch = useDispatch()
  const { gauges } = useSelector((state: RootState) => state.gauges)
  const fallbackImage = useColorModeValue(
    '/images/nft-bg-light.png',
    '/images/nft-bg-dark.png',
  )
  const { currentStakingAddress } = useSelector(
    (state: RootState) => state.nftFarms,
  )

  const getMintedNfts = async () => {
    const result = await getMintedNFTsByUser()
    if (!result?.isError) setNfts(result?.nfts)
  }

  const showToast = (msg: string, status: 'success' | 'error') => {
    toast({
      title: msg,
      status,
      duration: 4000,
      isClosable: true,
      position: 'top-right',
    })
  }

  const handleLock = async () => {
    if (nftId) {
      setLocking(true)
      const isTheCurrentOwner = await isTheOwner(nftId)
      if (isTheCurrentOwner) {
        const { isError, msg } = await approve(nftId)
        showToast(msg, isError ? 'error' : 'success')
      }
      const { isError, msg } = await stake(Number(nftId), lockPeriod)
      showToast(msg, isError ? 'error' : 'success')
      getMintedNfts()
      refetchTotalLiquidityLocked()
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
    try {
      const { isError, tokenURI: URI } = await tokenURI(tokenId)
      if (!isError) {
        console.log(URI)
        // setNftURI(URI)
        setNftURI('/images/brainy-nft-image.png')
        setNftId(tokenId)
        showToast('NFT successfully fetched', 'success')
        return
      }
      setNftURI('/')
      showToast('Invalid Token Id', 'error')
    } catch (err: any) {
      console.log(err.response.message)
    }
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
          py={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <Select
            w="auto"
            fontSize={{ md: 'xl' }}
            fontWeight="bold"
            variant="unstyled"
            onChange={value => dispatch(setCurrentStaking(value.target.value))}
            value={currentStakingAddress}
          >
            {gauges?.map(gauge => (
              <option value={gauge.gaugeAddress}>{gauge.name}</option>
            ))}
          </Select>
          <Spacer />
          <StakeInfoIcon handler={setOpenStakingInfo} />
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
          <Image src={nftURI} borderRadius="12px" fallbackSrc={fallbackImage} />
          <Box w="full" px={{ base: 0 }} py={2}>
            <Input
              onChange={event =>
                handleOnInputNftChange(Number(event.target.value))
              }
              px={[3, 4]}
              backgroundColor="subMenuBg"
              placeholder="Input Nft ID"
              w="full"
              border="none"
            />
          </Box>
        </Flex>
        <StakingLockPeriod
          lockPeriod={lockPeriod}
          isConnected={isConnected}
          rightAction={() => handleIncrementDecrement(lockPeriod + 1)}
          leftAction={() => handleIncrementDecrement(lockPeriod - 1)}
          InputAction={e => handleIncrementDecrement(Number(e.target.value))}
          sliderAction={val => handleIncrementDecrement(val)}
        />
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
          disabled={!nftId || locking || isDisconnected}
          onClick={handleLock}
        >
          Stake
        </Button>
      </Flex>
      <BrainiesStakes currentGauge="Brainy" />
      <StakingInfo
        isOpen={openStakingInfo}
        onClose={() => setOpenStakingInfo(false)}
        isBrainyStaking
      />
    </SimpleGrid>
  )
}

export default BrainyStaking
