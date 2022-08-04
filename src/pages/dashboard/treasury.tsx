import { DashboardLayout } from '@/components/dashboard/layout'
import { Flex, Heading, Image, Stack, Text, Wrap } from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'

const Treasury: NextPage = () => {
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="8">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Treasury
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            See all our NFT collections
          </Text>
        </Flex>
      </Flex>
      <Wrap mt="6">
        <Flex direction="column">
          <Image
            src="https://figma.com/file/wosuJaHeV318k1ON82CZpo/image/41a91aa29c98388443d8bce56ce8cf421ec4ff9d?fuid=943374801318148991"
            loading="lazy"
            width={{ base: '430.32px', md: '341.91px', lg: '474px' }}
            height={{ base: '411px', md: '328.23px', lg: '454px' }}
          />
          <Stack
            bg="linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.024) 100%)"
            backdropFilter="blur(87.3043px)"
            px={{ base: '2.5', lg: '3' }}
            pt={{ base: '3', md: '2.5', lg: '4' }}
            pb={{ base: '4', md: '2', lg: '6' }}
            transform="matrix(1, 0, 0, 1, 0, 0)"
            roundedBottom="lg"
            shadow="md"
            mt="-8"
          >
            <Text fontWeight="bold" fontSize="3xl">
              Bored Ape
            </Text>
            <Text fontWeight="medium" fontSize="lg">
              BAYC #9665
            </Text>
          </Stack>
        </Flex>
      </Wrap>
    </DashboardLayout>
  )
}

export default Treasury
