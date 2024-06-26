import React from 'react'
import { Box, Icon, LinkBox, Text } from '@chakra-ui/react'
import { CustomIconType } from '@/data/SidebarData'
import LinkOverlay from '../elements/LinkElements/LinkOverlay'

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
    <LinkBox onClick={() => console.log(name)}>
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
          <LinkOverlay href={route} target="_blank">
            <Icon as={icon} boxSize="14" _light={{ color: 'black' }} />
          </LinkOverlay>
        </Box>
        <Text fontSize={{ base: 'sm', lg: 'lg' }} mt={2} fontWeight="bold">
          {name}
        </Text>
      </Box>
    </LinkBox>
  )
}

export default PlatformCard
