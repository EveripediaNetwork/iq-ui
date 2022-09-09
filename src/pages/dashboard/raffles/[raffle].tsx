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
import React from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import { Search2Icon } from '@chakra-ui/icons'
import DisplayAvatar from '@/components/elements/Avatar/Avatar'

const Raffle = () => {
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6">
        <LinkBox>
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
              Shinsekai Raffles Results
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
              Here you can find all the addresses that won at the Shinsekai
              Raffle.
            </Text>
          </Flex>
          <Spacer />
          <Flex pt={{ base: 4, md: 0 }}>
            <InputGroup>
              <InputRightElement mr={3} pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputRightElement>
              <Input type="text" placeholder="Search By Address" />
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
            src="/images/juicy.png"
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
              <Tr whiteSpace="nowrap">
                <Td fontSize="sm" color="tooltipColor" border="none">
                  braindao
                </Td>
                <Td fontSize="sm" color="tooltipColor" border="none">
                  <Flex
                    align="center"
                    gap="18px"
                    cursor="pointer"
                    color="grayText3"
                    fontWeight="medium"
                  >
                    <DisplayAvatar />
                    <Text fontSize="sm" color="grayText3">
                      0xd8ff659b400d546bb7c6f2dcb2193d36de91ce7b
                    </Text>
                  </Flex>
                </Td>
                <Td fontSize="sm" color="tooltipColor" border="none">
                  1
                </Td>
                <Td fontSize="sm" color="tooltipColor" border="none">
                  19/JUL/2022
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </chakra.div>
      </Flex>
    </DashboardLayout>
  )
}

export default Raffle
