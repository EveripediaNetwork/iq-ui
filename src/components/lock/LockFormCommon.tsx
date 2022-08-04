import React from 'react'
import {
  Button,
  Flex,
  Icon,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Input,
} from '@chakra-ui/react'

import { RiQuestionLine } from 'react-icons/ri'

const LockFormCommon = ({ hasNewLockDate }: { hasNewLockDate?: boolean }) => {
  return (
    <>
      <Flex direction="column" w="full" gap="3">
        <Flex
          p="5"
          pr="5"
          rounded="lg"
          border="solid 1px"
          borderColor="divider"
        >
          <Flex direction="column" gap="2">
            <Text color="grayText2" fontSize="xs">
              Lock period (weeks)
            </Text>
            <RangeSlider
              colorScheme="pink"
              w={{ base: 170, md: 330, lg: 250 }}
              defaultValue={[50]}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Flex>
          <Flex ml="auto" align="end">
            <InputGroup bg="transparent" size="xs">
              <InputLeftAddon>
                <Text>-</Text>
              </InputLeftAddon>
              <Input placeholder="0" w="7" />
              <InputRightAddon>
                <Text>+</Text>
              </InputRightAddon>
            </InputGroup>
          </Flex>
        </Flex>
      </Flex>
      <Flex w="full" direction="column" gap="4" fontSize="xs">
        {hasNewLockDate && (
          <Flex rounded="md" align="center" bg="divider" p={2}>
            <Text>New lock date </Text>
            <Text fontWeight="semibold" color="brandText" ml="auto">
              thu, 06 Dec 2024, 01:00 GMT+1
            </Text>
          </Flex>
        )}
        <Flex rounded="md" align="center" bg="divider" p={2}>
          <Text>New HiIQ balance </Text>
          <Text fontWeight="semibold" color="brandText" ml="auto">
            23.00HiIQ
          </Text>
        </Flex>
        <Flex align="center" w="full">
          <Icon color="brandText" as={RiQuestionLine} mr={1} />
          <Text color="brandText" fontSize={{ base: 'xx-small', md: 'xs' }}>
            Your lock end date will be thu, 06 0ct 2022, 01:00 GMT+1
          </Text>
        </Flex>
      </Flex>
      <Button w="full">Lock</Button>
    </>
  )
}

export default LockFormCommon
