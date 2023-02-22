import React, { useState } from 'react'
import {
  Flex,
  useToast,
  Image,
  Box,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
import { useBrainy } from '@/hooks/useBrainy'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { getEpochTime } from '@/utils/gauges.util'
import GaugeSlider from './GaugeSlider'
import GaugesFormCommon from './GaugesFormCommon'

const StakeBrainy = () => {
  const [nftId, setNftId] = useState<number | undefined>()
  const { approve, isTheOwner, tokenURI } = useBrainy()
  const [isLoading, setIsLoading] = useState(false)
  const [, setLockPeriod] = useState(7)
  const [lockEnd, setLockEnd] = useState('')
  const { lockedStakes, stake, stakeMoreBrainy } = useNFTGauge()

  const fallbackImage = useColorModeValue(
    '/images/nft-bg-light.png',
    '/images/nft-bg-dark.png',
  )
  const [nftURI, setNftURI] = useState('')
  const toast = useToast()
  const showToast = (msg: string, status: 'success' | 'error') => {
    toast({
      title: msg,
      status,
      duration: 4000,
      isClosable: true,
      position: 'top-right',
    })
  }

  const handleOnInputNftChange = async (tokenId: number) => {
    try {
      const { isError, tokenURI: URI } = await tokenURI(tokenId)
      if (!isError) {
        // setNftURI(URI)
        console.log(URI)
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

  const updateLockPeriod = (days: number) => {
    setLockPeriod(days)
    const now = new Date()
    now.setSeconds(days * 86400)
    setLockEnd(now.toUTCString())
  }

  const handleLock = async () => {
    console.log(nftId)
    if (typeof nftId !== 'undefined') {
      setIsLoading(true)
      const isTheCurrentOwner = await isTheOwner(nftId)
      if (isTheCurrentOwner) {
        const { isError, msg } = await approve(nftId)
        if (isError) {
          showToast(msg, isError ? 'error' : 'success')
          setIsLoading(false)
          return
        }
        if (lockedStakes.length < 1) {
          const { isError: error, msg: stakeMsg } = await stake(
            Number(nftId),
            getEpochTime(lockEnd),
          )
          showToast(stakeMsg, error ? 'error' : 'success')
          setIsLoading(false)
          return
        }
        const { isError: error, msg: stakeMsg } = await stakeMoreBrainy(
          Number(nftId),
          lockedStakes[0].kek_id,
        )
        showToast(stakeMsg, error ? 'error' : 'success')
        setIsLoading(false)
      } else {
        showToast(
          'You need to be the owner of the nft before you can stake it',
          'error',
        )
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <Flex
        pt={2}
        mb={5}
        alignItems="center"
        direction="column"
        w={[250, 370]}
        background="nftBg"
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
      {lockedStakes.length < 1 && (
        <GaugeSlider
          updateLockPeriod={(days: number) => updateLockPeriod(days)}
        />
      )}
      <GaugesFormCommon
        handler={handleLock}
        lockEnd={lockEnd}
        locking={isLoading}
      />
    </>
  )
}

export default StakeBrainy
