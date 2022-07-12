import React from 'react'
import {Box, Icon, Text, } from '@chakra-ui/react'
import { CustomIconType } from '@/data/SidebarData'

const PlatformCard = ({icon, name}: {name: string, icon: CustomIconType}) => {
  return (
    <Box w={{ base: '132', md: '176' }} textAlign="center">
        <Box
            h={{ base: '92', md: '122' }}
            justifyContent="center"
            alignItems="center"
            display="flex"
            border="solid 1px "
            borderColor="whiteAlpha.200"
            rounded="lg"
        >
            <Icon as={icon} boxSize="14" />
        </Box>
        <Text
            fontSize={{ base: 'sm', lg: 'lg' }}
            mt={2}
            fontWeight="bold"
        >
            {name}
        </Text>
    </Box>
  )
}

export default PlatformCard
