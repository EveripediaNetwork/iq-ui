import { Stat, StatLabel, Flex } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

export const StatData = ({
  headerText,
  children,
}: {
  headerText: string
  children: ReactNode
}) => {
  return (
    <Stat>
      <Flex
        direction={{ base: 'row', md: 'column' }}
        align={{ base: 'center', md: 'inherit' }}
        gap="14px"
        px={{ base: '12px', md: '16px' }}
        py="14px"
        rounded="lg"
        border="solid 1px "
        borderColor="divider"
      >
        <StatLabel color="brandText" fontSize="14px">
          {headerText}
        </StatLabel>
        {children}
      </Flex>
    </Stat>
  )
}
