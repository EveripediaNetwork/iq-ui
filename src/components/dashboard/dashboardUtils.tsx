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
          {headerText}
        </StatLabel>
        {children}
      </Flex>
    </Stat>
  )
}
