import { numFormatter } from '@/utils/dashboard-utils'
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Skeleton,
  chakra,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { Dict } from '@chakra-ui/utils'
import React from 'react'

const TokenData = ({ marketData }: { marketData: Dict | null }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
      <Stat>
        <Flex
          minH={{ xl: '40', md: '25', base: '15' }}
          direction={{ base: 'row', md: 'column' }}
          align={{ base: 'center', md: 'inherit' }}
          gap="6"
          px="22px"
          py="18px"
          rounded="lg"
          border="solid 1px "
          borderColor="divider"
        >
          <StatLabel color="brandText" fontSize="medium">
            Market Cap
          </StatLabel>
          <chakra.div
            ml={{ base: 'auto', md: 'initial' }}
            sx={{
              '.chakra-stat__help-text': {
                h: 'fit-content',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {marketData !== null ? (
              <StatNumber display="flex" justifyContent="center">
                <chakra.span
                  fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                  order={{ base: '1', md: 'unset' }}
                  fontWeight="semibold"
                >
                  ${numFormatter(marketData?.market_cap.usd)}
                </chakra.span>
                <StatHelpText position="relative">
                  <StatArrow
                    type={
                      marketData?.market_cap_change_percentage_24h
                        .toString()
                        .charAt(0) === '-'
                        ? 'decrease'
                        : 'increase'
                    }
                  />
                  <chakra.span
                    color={
                      marketData?.market_cap_change_percentage_24h
                        .toString()
                        .charAt(0) === '-'
                        ? 'red.500'
                        : 'green'
                    }
                    fontSize={{ base: 'xs', md: 'inherit' }}
                    mr={{ base: 1, md: 0 }}
                  >
                    {marketData?.market_cap_change_percentage_24h
                      .toFixed(2)
                      .toString()}
                    %
                  </chakra.span>
                </StatHelpText>
              </StatNumber>
            ) : (
              <Skeleton
                height={{ xl: '30px', base: '18px' }}
                mt={{ md: '5' }}
                w={{ xl: 'full', base: '24' }}
                borderRadius="full"
              />
            )}
          </chakra.div>
        </Flex>
      </Stat>
      <Stat>
        <Flex
          minH={{ xl: '40', md: '25', base: '15' }}
          direction={{ base: 'row', md: 'column' }}
          align={{ base: 'center', md: 'inherit' }}
          gap="6"
          px="22px"
          py="18px"
          rounded="lg"
          border="solid 1px "
          borderColor="divider"
        >
          <StatLabel color="brandText" fontSize="medium">
            Circulating supply
          </StatLabel>
          <chakra.div ml={{ base: 'auto', md: 'initial' }}>
            {marketData !== null ? (
              <StatNumber display="flex" justifyContent="center">
                <chakra.span
                  fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                  order={{ base: '1', md: 'unset' }}
                >
                  {numFormatter(marketData?.circulating_supply)} IQ
                </chakra.span>
              </StatNumber>
            ) : (
              <Skeleton
                height={{ xl: '30px', base: '18px' }}
                mt={{ md: '5', base: '0' }}
                w={{ xl: 'full', base: '24' }}
                borderRadius="full"
              />
            )}
          </chakra.div>
        </Flex>
      </Stat>
      <Stat>
        <Flex
          minH={{ xl: '40', md: '25', base: '15' }}
          direction={{ base: 'row', md: 'column' }}
          align={{ base: 'center', md: 'inherit' }}
          gap="6"
          px="22px"
          py="18px"
          rounded="lg"
          border="solid 1px "
          borderColor="divider"
        >
          <StatLabel color="brandText" fontSize="medium">
            {' '}
            24hr volume
          </StatLabel>
          <chakra.div ml={{ base: 'auto', md: 'initial' }}>
            {marketData !== null ? (
              <StatNumber display="flex" justifyContent="center">
                <chakra.span
                  fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                  order={{ base: '1', md: 'unset' }}
                >
                  ${numFormatter(marketData?.total_volume.usd)}
                </chakra.span>
              </StatNumber>
            ) : (
              <Skeleton
                height={{ xl: '30px', base: '18px' }}
                mt={{ md: '5', base: '0' }}
                w={{ xl: 'full', base: '24' }}
                borderRadius="full"
              />
            )}
          </chakra.div>
        </Flex>
      </Stat>
    </SimpleGrid>
  )
}

export default TokenData
