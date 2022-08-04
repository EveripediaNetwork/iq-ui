import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Badge, Flex, IconButton, Text, Input, VStack } from '@chakra-ui/react'
import React from 'react'
import { RiArrowDownLine } from 'react-icons/ri'

import LockFormCommon from './LockFormCommon'

const LockForm = () => {
  return (
    <VStack w="full" rowGap={4}>
      <Flex
        w="full"
        p="3"
        pr="5"
        rounded="lg"
        border="solid 1px"
        borderColor="divider"
      >
        <Flex direction="column" gap="1.5">
          <Text color="grayText2" fontSize="xs">
            Send:
          </Text>
          <Flex gap="1" align="center">
            <Input variant="unstyled" w={12} placeholder="23.00" />
            <Text color="grayText2" fontSize="xs">
              (~$234.00)
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" ml="auto" align="end" gap="1.5">
          <Flex gap="1" align="center">
            <Text color="grayText2" fontSize="xs">
              Balance: 500.92
            </Text>
            <Badge
              variant="solid"
              bg="brand.50"
              color="brandText"
              _dark={{
                bg: 'brand.200',
              }}
              colorScheme="brand"
              rounded="md"
              fontWeight="normal"
            >
              MAX
            </Badge>
          </Flex>
          <Flex gap="1" align="center">
            <BraindaoLogo3 w="6" h="5" />
            <Text fontWeight="medium">IQ</Text>
          </Flex>
        </Flex>
      </Flex>
      <IconButton
        icon={<RiArrowDownLine />}
        aria-label="Swap"
        variant="outline"
        w="fit-content"
        mx="auto"
        color="brandText"
      />
      <Flex direction="column" w="full" gap="3">
        <Flex
          p="3"
          pr="5"
          rounded="lg"
          border="solid 1px"
          borderColor="divider"
        >
          <Flex direction="column" gap="1.5">
            <Text color="grayText2" fontSize="xs">
              Recieve:
            </Text>
            <Flex gap="1" align="center">
              <Text fontWeight="semibold">23.00</Text>
              <Text color="grayText2" fontSize="xs">
                (~$234.00)
              </Text>
            </Flex>
          </Flex>
          <Flex ml="auto" align="end" gap="1">
            <BraindaoLogo3 w="6" h="5" />
            <Text fontWeight="medium">HiIQ</Text>
          </Flex>
        </Flex>
      </Flex>
      <LockFormCommon />
    </VStack>
  )
}

export default LockForm
