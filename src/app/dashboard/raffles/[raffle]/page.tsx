'use client'

import {
  Flex,
  Text,
  Icon,
  LinkBox,
  useBreakpointValue,
  Stack,
  Heading,
  Box,
  Image,
  chakra,
  Divider,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'
import { Raffle } from '@/types/raffle'
import { RAFFLE_DATA } from '@/data/RaffleData'
import { Search2Icon } from '@chakra-ui/icons'
import { NextSeo } from 'next-seo'
import Link from '@/components/elements/LinkElements/Link'
import RaffleLoading from '@/components/raffle/RaffleLoading'
import RaffleTable from '@/components/raffle/RaffleTable'

const RafflePage = ({ params }: { params: { raffle: string } }) => {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [filteredDetails, setFilteredDetails] = useState<Raffle['details']>([])
  const [raffle, setRaffle] = useState<Raffle>()
  const [loading, setLoading] = useState(true)
  const slug = params.raffle
  const isShortened = useBreakpointValue({ base: true, md: false })

  const handleSearchAddress = (text: string) => {
    setSearchText(text)
    if (raffle) {
      if (text.length > 1) {
        const updatedDetails = raffle.details.filter((d) =>
          d.address.includes(text),
        )
        setFilteredDetails(updatedDetails)
        return
      }
      setFilteredDetails(raffle?.details)
    }
  }

  useEffect(() => {
    const getRaffle = RAFFLE_DATA.find((r) => r.slug === slug)
    if (getRaffle) {
      setRaffle(getRaffle)
      setFilteredDetails(getRaffle?.details)
    }
    setLoading(false)
  }, [slug])

  return (
    <>
      {raffle && (
        <NextSeo
          title={raffle.title}
          description={raffle.body}
          openGraph={{
            title: raffle.title,
            description: raffle.body,
            images: [
              {
                url: `${raffle.imageUrl}`,
              },
            ],
          }}
        />
      )}
      <Flex py={{ base: '5', lg: '6' }} direction="column" gap="6">
        <LinkBox onClick={() => router.back()}>
          <Flex
            align="center"
            gap="18px"
            cursor="pointer"
            color="grayText3"
            fontWeight="medium"
          >
            <Icon as={RiArrowLeftLine} boxSize="5" />
            <Text fontSize="sm" color="grayText3" fontWeight="medium">
              Go back to Raffles
            </Text>
          </Flex>
        </LinkBox>
        {!raffle && !loading && <RaffleLoading />}
        {raffle && !loading && (
          <>
            <Stack direction={['column', 'row']}>
              <Flex direction="column" gap="2">
                <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
                  {raffle.title}
                </Heading>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  color="fadedText"
                  fontWeight="medium"
                >
                  Here you can find all the addresses that won at the{' '}
                  {raffle.title} Raffle.
                </Text>
              </Flex>
            </Stack>
            <Box
              borderWidth="1px"
              overflow="hidden"
              rounded="lg"
              border="solid 1px"
              borderColor="divider"
              w="full"
            >
              <Image
                src={`${raffle.imageUrl}`}
                loading="lazy"
                width="full"
                height="175px"
                fit="cover"
              />
            </Box>
            <chakra.div
              overflowX="auto"
              border="solid 1px"
              borderColor="divider2"
              rounded="lg"
              mt="2"
              fontSize="sm"
              mb={{ base: '24', md: '0' }}
            >
              <Flex
                py={4}
                justify="space-between"
                display="flex"
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'center' }}
              >
                <Text
                  fontSize="lg"
                  px={4}
                  mb={{ base: 4, lg: 0 }}
                  fontWeight="bold"
                >
                  Raffles ({raffle.details.length})
                </Text>
                <Divider display={{ lg: 'none' }} />
                <Flex
                  mt={{ base: 3, lg: 0 }}
                  px={4}
                  columnGap={8}
                  rowGap={3}
                  direction={{ base: 'column', md: 'row' }}
                  justify={{ md: 'space-between', lg: 'normal' }}
                >
                  <Flex>
                    <InputGroup size="sm" borderColor="divider2">
                      <InputLeftElement mr={3} pointerEvents="none">
                        <Search2Icon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        value={searchText}
                        onChange={(e) => handleSearchAddress(e.target.value)}
                        type="text"
                        placeholder="Search By Address"
                        w={300}
                        rounded="md"
                      />
                    </InputGroup>
                  </Flex>
                  <Flex alignItems="center">
                    <Link
                      href={`https://ipfs.everipedia.org/ipfs/${raffle.snapshotLink}`}
                      isExternal
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Snapshot
                    </Link>
                    <Link
                      href="https://polygonscan.com/address/0xb7185e8332fc2ff1a02664312288e11c39c0dbd0#events"
                      ml="4"
                      isExternal
                      color="brandText"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Onchain Results
                    </Link>
                  </Flex>
                </Flex>
              </Flex>
              <RaffleTable
                filteredDetails={filteredDetails}
                isShortened={isShortened}
              />
            </chakra.div>
          </>
        )}
      </Flex>
    </>
  )
}

export default RafflePage
