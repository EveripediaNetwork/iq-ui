import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Text,
  Icon,
  LinkBox,
  useBreakpointValue,
  useColorMode,
  Stack,
  Heading,
  Box,
  Image,
  chakra,
  Divider,
  InputGroup,
  InputLeftElement,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { Raffle } from '@/types/raffle'
import { RAFFLE_DATA } from '@/data/RaffleData'
import { RaffleEmptyState } from '@/components/illustrations/RaffleEmptyState'
import { Search2Icon } from '@chakra-ui/icons'
import DisplayAvatar from '@/components/elements/Avatar/Avatar'
import shortenAccount from '@/utils/shortenAccount'

const RafflePage = ({ raffle }: { raffle: Raffle }) => {
  const [searchText, setSearchText] = useState('')
  const [filteredDetails, setFilteredDetails] = useState<Raffle['details']>([])
  const router = useRouter()
  const isShortened = useBreakpointValue({ base: true, md: false })
  const { colorMode } = useColorMode()

  const handleSearchAddress = (text: string) => {
    setSearchText(text)
    if (text.length > 1) {
      const updatedDetails = raffle.details.filter(d =>
        d.address.includes(text),
      )
      setFilteredDetails(updatedDetails)
      return
    }
    setFilteredDetails(raffle?.details)
  }

  useEffect(() => {
    setFilteredDetails(raffle?.details)
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
        {!raffle ? (
          <Flex
            direction="column"
            gap="10"
            textAlign="center"
            align="center"
            mt="16"
          >
            <RaffleEmptyState colorMode={colorMode} />
            <Text maxW={{ md: '55%' }}>
              There is no raffle with this title at the moment. Check back again
              to see raffle results and wins.
            </Text>
          </Flex>
        ) : (
          <>
            <Stack direction={['column', 'row']}>
              <Flex direction="column" gap="2">
                <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
                  {raffle.title}
                </Heading>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
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
                        onChange={e => handleSearchAddress(e.target.value)}
                        type="text"
                        placeholder="Search By Address"
                        w={300}
                        rounded="md"
                      />
                    </InputGroup>
                  </Flex>
                  <Flex alignItems="center">
                    <Text
                      cursor="pointer"
                      onClick={() =>
                        window.open(
                          `https://ipfs.everipedia.org/ipfs/${raffle.snapshotLink}`,
                          '_blank',
                        )
                      }
                      as="span"
                      color="brandText"
                      fontSize="sm"
                    >
                      Snapshot
                    </Text>
                    <Text
                      cursor="pointer"
                      onClick={() =>
                        window.open(
                          `https://polygonscan.com/address/0xb7185e8332fc2ff1a02664312288e11c39c0dbd0#events`,
                          '_blank',
                        )
                      }
                      as="span"
                      ml="4"
                      color="brandText"
                      fontSize="sm"
                    >
                      Onchain Results
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Table fontWeight="semibold">
                <Thead border="none" bg="cardBg2">
                  <Tr>
                    {['Address', 'No of raffles won'].map(column => (
                      <Th
                        border="none"
                        whiteSpace="nowrap"
                        py="5"
                        textTransform="none"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="grayText4"
                        textAlign={
                          column.includes('raffles') ? 'center' : 'left'
                        }
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
                        <Flex
                          align="center"
                          gap="18px"
                          color="grayText3"
                          fontWeight="medium"
                          cursor="pointer"
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/address/${r.address}`,
                              '_blank',
                            )
                          }
                        >
                          <DisplayAvatar address={r.address} />
                          <Text fontSize="sm" color="grayText3">
                            {!isShortened
                              ? r.address
                              : shortenAccount(r.address)}
                          </Text>
                        </Flex>
                      </Td>
                      <Td
                        fontSize="sm"
                        color="grayText3"
                        textAlign="center"
                        border="none"
                      >
                        {r.qty}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </chakra.div>
          </>
        )}
      </Flex>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const slug: string = context.params?.raffle as string
  const raffle = RAFFLE_DATA.find(r => r.slug === slug)
  return {
    props: {
      raffle: raffle || null,
    },
  }
}

export default RafflePage
