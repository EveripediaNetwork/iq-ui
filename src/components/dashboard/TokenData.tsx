import { numFormatter } from '@/utils/dashboard-utils'
import {
  StatNumber,
  StatHelpText,
  StatArrow,
  Skeleton,
  chakra,
  SimpleGrid,
} from '@chakra-ui/react'
import { Dict } from '@chakra-ui/utils'
import React from 'react'
import { StatData } from './dashboardUtils'

export const TokenDataVal = ({
  text,
  marketData,
  subVal,
}: {
  text: string
  marketData: Dict<any> | null
  subVal: boolean
}) => {
  return (
    <chakra.div ml={{ base: 'auto', md: 'initial' }}>
      {marketData !== null ? (
        <StatNumber display="flex" justifyContent="center">
          <chakra.span
            fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
            order={{ base: '1', md: 'unset' }}
          >
            {subVal ? (
              <>${numFormatter(marketData?.total_volume.usd)}</>
            ) : (
              numFormatter(marketData?.circulating_supply)
            )}{' '}
            {text}
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
  )
}

const TokenData = ({ marketData }: { marketData: Dict | null }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
      <StatData headerText="Market Cap">
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
      </StatData>
      <StatData headerText="Circulating supply">
        <TokenDataVal text="IQ" marketData={marketData} subVal={false} />
      </StatData>
      <StatData headerText="24hr volume">
        <TokenDataVal text="" marketData={marketData} subVal />
      </StatData>
    </SimpleGrid>
  )
}

export default TokenData
