import React from 'react'
import { Box, Icon, Text } from '@chakra-ui/react'
import { CustomIconType } from '@/data/SidebarData'

const PlatformCard = ({
  icon,
  name,
  route,
}: {
  name: string
  icon: CustomIconType
  route: string
}) => {
  return (
    <Box w={{ base: '132', md: '176' }} textAlign="center">
      <Box
        h={{ base: '92', md: '122' }}
        justifyContent="center"
        alignItems="center"
        display="flex"
        border="solid 1px "
        borderColor="divider"
        rounded="lg"
        _hover={{
          bg: 'divider',
          color: 'dimmedText',
        }}
        cursor="pointer"
      >
        <a href={route} target="_blank" rel="noreferrer">
          <Icon as={icon} boxSize="14" _light={{ color: 'black' }} />
        </a>
      </Box>

      <Text fontSize={{ base: 'sm', lg: 'lg' }} mt={2} fontWeight="bold">
        {name}
      </Text>
    </Box>
  )
}

export default PlatformCard
