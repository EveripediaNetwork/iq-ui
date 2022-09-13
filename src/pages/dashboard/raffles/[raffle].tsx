import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Heading,
  Text,
  Icon,
  LinkBox,
  Stack,
  InputGroup,
  InputRightElement,
  Input,
  Spacer,
  Image,
  Box,
  chakra,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import { Search2Icon } from '@chakra-ui/icons'
import DisplayAvatar from '@/components/elements/Avatar/Avatar'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { Raffle } from '@/types/raffle'
import { RAFFLE_DATA } from '@/data/RaffleData'

const RafflePage = ({ raffle }: { raffle: Raffle }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredDetails, setFilteredDetails] = useState<Raffle['details']>([])
  const router = useRouter()

  const handleSearchAddress = (text: string) => {
    setSearchText(text)
    if (text.length > 2) {
      const updatedDetails = raffle.details.filter(d =>
        d.address.includes(text),
      )
      setFilteredDetails(updatedDetails)
      return
    }
    setFilteredDetails(raffle.details)
  }

  useEffect(() => {
    setFilteredDetails(raffle.details)
  }, [raffle])

  return (
    <DashboardLayout>
      <Flex direction="column" gap="6">
        <LinkBox onClick={() => router.back()}>
          <Flex
            align="center"
            gap="18px"
            cursor="pointer"
            color="grayText3"
            fontWeight="medium"
          >
            <Icon as={RiArrowLeftLine} boxSize="5" />
            <Text fontSize="sm" color="grayText3">
              Go back to Raffles
            </Text>
          </Flex>
        </LinkBox>

        <Stack direction={['column', 'row']}>
          <Flex direction="column" gap="2">
            <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
              {raffle.title}
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
              Here you can find all the addresses that won at the {raffle.title}{' '}
              Raffle.
            </Text>
          </Flex>
          <Spacer />
          <Flex pt={{ base: 4, md: 0 }}>
            <InputGroup>
              <InputRightElement mr={3} pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputRightElement>
              <Input
                value={searchText}
                onChange={e => handleSearchAddress(e.target.value)}
                type="text"
                placeholder="Search By Address"
              />
            </InputGroup>
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
        >
          <Table fontWeight="semibold">
            <Thead border="none" bg="cardBg2">
              <Tr>
                {[
                  'Name',
                  'Address',
                  'Total of Raffles Won',
                  'Raffles Date',
                ].map(column => (
                  <Th
                    border="none"
                    whiteSpace="nowrap"
                    py="5"
                    textTransform="none"
                    fontSize="sm"
                  >
                    {column}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {filteredDetails.map(r => (
                <Tr whiteSpace="nowrap">
                  <Td fontSize="sm" color="tooltipColor" border="none">
                    {r.name}
                  </Td>
                  <Td fontSize="sm" color="tooltipColor" border="none">
                    <Flex
                      align="center"
                      gap="18px"
                      cursor="pointer"
                      color="grayText3"
                      fontWeight="medium"
                    >
                      <DisplayAvatar address={r.address} />
                      <Text fontSize="sm" color="grayText3">
                        {r.address}
                      </Text>
                    </Flex>
                  </Td>
                  <Td fontSize="sm" color="tooltipColor" border="none">
                    {r.qty}
                  </Td>
                  <Td fontSize="sm" color="tooltipColor" border="none">
                    {raffle.date}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </chakra.div>
      </Flex>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug: string = context.params?.raffle as string
  const raffle = RAFFLE_DATA.find(r => r.slug === slug)
  return {
    props: {
      raffle: raffle || {},
    },
  }
}

export default RafflePage
