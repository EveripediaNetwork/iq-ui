'use client'
import React from 'react'
import { RAFFLE_DATA } from '@/data/RaffleData'
import {
  Image,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  Divider,
  Box,
  HStack,
  VStack,
  chakra,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'


const RafflePage = () => {
    const router = useRouter()
  return (
    <Flex pt={{ base: '5', lg: '6' }} direction="column" gap="6" pb="20">
      <Flex direction="column" gap="1">
        <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
          NFT Raffles
        </Heading>
      </Flex>
      <SimpleGrid mt="4" columns={{ base: 1, lg: 2 }} spacingX={4} spacingY={8}>
        {RAFFLE_DATA.map((raffle, index) => (
          <Box
            key={index}
            borderWidth="1px"
            overflow="hidden"
            rounded="xl"
            border="solid 1px"
            borderColor="divider"
            w="full"
            maxW="576px"
            onClick={() => router.push(`/dashboard/raffles/${raffle.slug}`)}
            cursor="pointer"
          >
            <Image
              src={raffle.imageUrl}
              loading="lazy"
              width="full"
              height="260px"
              fit="cover"
            />
            <Stack
              px={{ base: '2.5', lg: '3' }}
              pt={{ base: '3', md: '2.5', lg: '4' }}
              pb={{ base: '4', md: '2' }}
              bg="lightCard"
            >
              <HStack display="flex" justify="space-between">
                <Text
                  py="1"
                  fontWeight="medium"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {raffle.title}
                </Text>
                <Text
                  py="1"
                  fontWeight="medium"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {raffle.date}
                </Text>
              </HStack>
              <Divider orientation="horizontal" />
              <VStack
                h={{ base: 'auto', md: 50, lg: 30 }}
                display="flex"
                justify="space-between"
                align="start"
              >
                <Text py={2} fontSize="sm" fontWeight="medium">
                  {raffle.body}
                </Text>
                <Text fontWeight="medium" py={2} fontSize="sm">
                  Made by:{' '}
                  <chakra.span fontStyle="italic">{raffle.madeBy}</chakra.span>
                </Text>
              </VStack>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Flex>
  )
}

export default RafflePage
