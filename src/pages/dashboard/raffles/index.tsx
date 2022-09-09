import { DashboardLayout } from '@/components/dashboard/layout'
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
} from '@chakra-ui/react'
import React from 'react'

const Raffles = () => {
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="4" pb="20">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Raffles
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Follow all the raffles made within the IQ world.
          </Text>
        </Flex>
        <SimpleGrid
          mt="4"
          columns={{ base: 1, md: 2 }}
          spacingX={4}
          spacingY={8}
        >
          {RAFFLE_DATA.map((raffle, index) => (
            <Box key={index} borderWidth='1px' overflow='hidden' rounded="lg" border="solid 1px" borderColor="divider" w="full">
              <Image
                src={raffle.imageUrl}
                loading="lazy"
                width="auto"
                height="175px"
                fit="cover"
              />
              <Stack
                px={{ base: '2.5', lg: '3' }}
                pt={{ base: '3', md: '2.5', lg: '4' }}
                pb={{ base: '4', md: '2', lg: '6' }}
                bg="lightCard"
              >
                <Text  py="1" fontWeight="medium" fontSize="lg">
                  {raffle.title}
                </Text>
                <Divider orientation="horizontal" />
                <Box h={{base: 'auto', "md": 50, "lg": 30}}>
                  <Text py={2} fontSize="sm">
                    {raffle.body}
                  </Text>
                  <Text fontWeight="medium" py={2} fontSize="sm">
                    made by: {raffle.madeBy}
                  </Text>
                </Box>
                <Divider orientation="horizontal" />
                <Box display="flex" py="1" alignItems="center">
                  <Text as="span" color="brandText" fontSize="sm">
                    Snapshot
                  </Text>
                  <Text as="span" ml="4" color="brandText" fontSize="sm">
                    Onchain Resuls
                  </Text>
                </Box>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </DashboardLayout>
  )
}

export default Raffles
