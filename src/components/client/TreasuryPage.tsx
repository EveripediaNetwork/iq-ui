'use client'

import { TREASURIES } from '@/data/treasury-data'
import {
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Box,
  chakra,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'
import Link from '@/components/elements/LinkElements/Link'
import { TreasuryGraphTable } from '../dashboard/TreasuryGraphTable'
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'

const TreasuryPage: NextPage = () => {
  const options: EmblaOptionsType = {
    containScroll: 'trimSnaps',
  }

  const [emblaRef] = useEmblaCarousel(options)

  return (
    <>
      <Flex direction="column" gap="6" py={{ base: '5', lg: '6' }}>
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            <Box as="span">
              <Link
                href="https://etherscan.io/address/0x56398b89d53e8731bca8c1b06886cfb14bd6b654"
                isExternal
              >
                BrainDAO.eth
              </Link>
            </Box>
            <Box as="span"> Treasury</Box>
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fadedText4"
            fontWeight="medium"
          >
            See all the cryptocurrencies and NFTs held in BrainDAO’s diversified
            treasury.
          </Text>
        </Flex>
      </Flex>
      <TreasuryGraphTable />
      <chakra.div
        ref={emblaRef}
        overflow="hidden"
        w="full"
        mt={{ base: '0', lg: '8' }}
        mb={{ base: '24', lg: '10' }}
      >
        <Flex w="full" gap={{ md: '26px', lg: '40px' }}>
          {TREASURIES.map((treasury, i) => (
            <Box
              key={i}
              flex="0 0 auto"
              minW="0"
              width={{ base: '430.32px', md: '341.91px', lg: '384px' }}
              maxW="100%"
              onClick={() =>
                treasury.href && window.open(`${treasury.href}`, '_blank')
              }
              display={{
                base: 'block',
              }}
              overflow="hidden"
            >
              <Flex direction="column" w="100%" maxW="full" cursor="pointer">
                <Image
                  src={treasury.image}
                  loading="lazy"
                  width="full"
                  objectFit="cover"
                  objectPosition="top"
                  height={{ base: '411px', md: '328.23px', lg: '367px' }}
                  borderTopRightRadius="8"
                  borderTopLeftRadius="8"
                />
                <Stack
                  bg="linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.024) 100%)"
                  backdropFilter="blur(87.3043px)"
                  px={{ base: '2.5', lg: '3' }}
                  pb={{ base: '4', md: '2', lg: '2' }}
                  transform="matrix(1, 0, 0, 1, 0, 0)"
                  roundedBottom="lg"
                  mt="-2"
                  borderBottom="1px solid"
                  borderRight="1px solid"
                  borderLeft="1px solid"
                  borderColor="divider"
                >
                  <Text fontWeight="bold" fontSize="2xl">
                    {treasury.title}
                  </Text>
                  <Text fontWeight="medium" fontSize="lg">
                    {treasury.body}
                  </Text>
                </Stack>
              </Flex>
            </Box>
          ))}
        </Flex>
      </chakra.div>
      {/* </SimpleGrid> */}
    </>
  )
}

export default TreasuryPage
