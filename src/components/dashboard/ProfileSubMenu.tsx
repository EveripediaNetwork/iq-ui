import React from 'react'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import shortenAccount from '@/utils/shortenAccount'
import DisplayAvatar from '@/components/elements/Avatar/Avatar'
import { useAccount } from 'wagmi'
import { FaChevronDown } from 'react-icons/fa'
import ProfileSubMenuDetails from './ProfileSubMenuDetails'

const ProfileSubMenu = () => {
  const { address } = useAccount()
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          size="sm"
          fontWeight="500"
          variant="outline"
          leftIcon={
            <DisplayAvatar
              svgProps={{ rounded: 'full' }}
              size={20}
              address={"0x9fEAB70f3c4a944B97b7565BAc4991dF5B7A69ff"}
            />
          }
          rightIcon={<FaChevronDown />}
        >
          <Text fontSize={{ base: 'xs', lg: 'sm' }} fontWeight="medium">
            {address && shortenAccount(address)}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        pt="5"
        pb="6"
        bg="bodyBg"
        w="355px"
        mr={{ md: '13', lg: '16' }}
        boxShadow="2xl"
      >
        <ProfileSubMenuDetails />
      </PopoverContent>
    </Popover>
  )
}

export default React.memo(ProfileSubMenu)
