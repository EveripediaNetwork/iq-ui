import StakeCard from '@/components/cards/StakeCard'
import { DashboardLayout } from '@/components/dashboard/layout'
import LockForm from '@/components/lock/LockForm'
import LockFormCommon from '@/components/lock/LockFormCommon'
import RewardCalculator from '@/components/lock/RewardCalculator'
import StakingInfo from '@/components/lock/StakingInfo'
import UnlockNotification from '@/components/lock/UnlockNotification'
import { LOCK_DATA } from '@/data/LockData'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
  Stack,
  Box,
  SimpleGrid,
  Spacer,
  VStack,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  RiCalculatorFill,
  RiExternalLinkLine,
  RiLinksLine,
  RiQuestionLine,
} from 'react-icons/ri'

const Lock = () => {
  const bStyles = {
    borderLeft: 'solid 1px',
    borderColor: 'divider2',
  }
  const [openUnlockNotification, setOpenUnlockNotification] = useState(false)
  const [openStakingInfo, setOpenStakingInfo] = useState(false)
  const [openRewardCalculator, setOpenRewardCalculator] = useState(false)
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="4" pb="20">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            HiIQ
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Lock IQ token over a period of time and earn IQ token rewards.
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          px={{ base: '8', md: '2' }}
          py="3"
          mt="7"
          spacingY="13px"
          border="solid 1px"
          borderColor="divider"
          rounded="lg"
          bg="divider"
        >
          {LOCK_DATA.map((lock, index) => (
            <StakeCard
              {...(index !== 0 && bStyles)}
              borderLeftWidth={index === 2 ? { base: '0', md: '1px' } : 'none'}
              key={lock.title}
              title={lock.title}
              value={lock.value}
            />
          ))}
        </SimpleGrid>
        <Flex pb="10" w="full" mt="3">
          <SimpleGrid
            justifyContent="center"
            ml={{ lg: '3%' }}
            w="full"
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, lg: 0, '2xl': 4 }}
          >
            <Flex
              maxW={{ base: 526, lg: '576' }}
              w="full"
              p="5"
              rounded="lg"
              border="solid 1px"
              borderColor="divider"
              direction="column"
              gap="6"
              mx="auto"
              mb="auto"
            >
              <Flex gap="2.5" align="center">
                <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
                  Lock IQ
                </Heading>
                <Spacer />
                <Icon
                  color="brandText"
                  cursor="pointer"
                  onClick={() => setOpenStakingInfo(true)}
                  fontSize={20}
                  as={RiQuestionLine}
                />
              </Flex>
              <Box
                alignSelf="center"
                rounded="md"
                width={{ md: 355 }}
                bg="divider"
                textAlign="center"
                p={4}
              >
                <Text fontSize={{ base: 'xs', md: 'sm' }}>
                  You have locked a total of 600 IQ. Expiring on thu, 06 0ct
                  2022, 01:00 GMT+1
                </Text>
              </Box>
              <Tabs variant="unstyled">
                <TabList display="flex" justifyContent="center">
                  <Tab
                    px={{ base: 3, md: 4 }}
                    border="1px solid"
                    fontWeight={{ md: 'bold' }}
                    fontSize="xs"
                    borderColor="divider2"
                    borderLeftRadius="5"
                    borderRightColor="transparent"
                    _selected={{ color: 'white', bg: 'brandText' }}
                  >
                    Add to IQ staked
                  </Tab>
                  <Tab
                    px={{ base: 3, md: 4 }}
                    border="1px solid"
                    fontWeight={{ md: 'bold' }}
                    fontSize="xs"
                    borderColor="divider2"
                    borderRightRadius="5"
                    borderLeftColor="transparent"
                    _selected={{ color: 'white', bg: 'brandText' }}
                  >
                    Increase Lock time
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0} pt={6}>
                    <LockForm />
                  </TabPanel>
                  <TabPanel p={0} mt={7}>
                    <VStack rowGap={6}>
                      <LockFormCommon hasNewLockDate />
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
            <Flex
              direction="column"
              py="6"
              rounded="lg"
              border="solid 1px "
              borderColor="divider"
              align="center"
              maxW={{ base: 526, lg: 400 }}
              w="full"
              rowGap={5}
              mx={{ base: 'auto', lg: 'none' }}
              mb="auto"
            >
              <VStack align="center" rowGap={2}>
                <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
                  Current Lock
                </Heading>
                <Divider
                  w="30"
                  borderColor="divider"
                  display={{ base: 'none', lg: 'inherit' }}
                />
              </VStack>

              <VStack align="center">
                <Text color="grayText2" fontSize="md">
                  IQ Locked
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  23.00 IQ
                </Text>
              </VStack>
              <VStack align="center">
                <Text color="grayText2" fontSize="md">
                  HiIQ Balance
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  23.00HiIQ
                </Text>
              </VStack>
              <VStack align="center">
                <Text color="grayText2" fontSize="md">
                  Time Remaining
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  -
                </Text>
              </VStack>
              <VStack align="center">
                <Text color="grayText2" fontSize="md">
                  Claimable Reward
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  -
                </Text>
              </VStack>
              <VStack rowGap={2}>
                <Stack direction="row" spacing={3}>
                  <Button
                    fontSize={{ base: 'xs', md: 'sm' }}
                    w={{ base: 130, md: 164 }}
                    variant="solid"
                  >
                    Claim Rewards
                  </Button>
                  <Button
                    borderColor="divider2"
                    variant="outline"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    w={{ base: 130, md: 164 }}
                  >
                    Checkpoint
                  </Button>
                  <Tooltip
                    color="tooltipColor"
                    placement="top"
                    rounded="lg"
                    p={5}
                    bg="tooltipBg"
                    shouldWrapChildren
                    hasArrow
                    label="If you increase your HiIQ, there is need to update your rewards and account for the new amount."
                  >
                    <Icon color="brandText" as={RiQuestionLine} mr={1} />
                  </Tooltip>
                </Stack>
                <Button
                  onClick={() => setOpenUnlockNotification(true)}
                  fontWeight="bold"
                  color="brand.500"
                  variant="ghost"
                >
                  Unlock
                </Button>
              </VStack>
              <VStack rowGap={2}>
                <Stack direction="row" spacing={36}>
                  <Stack direction="row" spacing={2}>
                    <Icon fontSize={23} as={RiCalculatorFill} />
                    <Text color="grayText2" fontSize="sm">
                      Reward Calculator{' '}
                    </Text>
                  </Stack>
                  <Icon
                    cursor="pointer"
                    onClick={() => setOpenRewardCalculator(true)}
                    fontSize={23}
                    as={RiExternalLinkLine}
                  />
                </Stack>
                <Stack direction="row" spacing={28}>
                  <Stack direction="row" spacing={2}>
                    <Icon fontSize={23} as={RiLinksLine} />
                    <Text color="grayText2" fontSize="sm">
                      View Contract Address{' '}
                    </Text>
                  </Stack>
                  <Icon fontSize={23} as={RiExternalLinkLine} />
                </Stack>
              </VStack>
            </Flex>
          </SimpleGrid>
        </Flex>
      </Flex>
      <UnlockNotification
        isOpen={openUnlockNotification}
        onClose={() => setOpenUnlockNotification(false)}
      />
      <StakingInfo
        isOpen={openStakingInfo}
        onClose={() => setOpenStakingInfo(false)}
      />
      <RewardCalculator
        isOpen={openRewardCalculator}
        onClose={() => setOpenRewardCalculator(false)}
      />
    </DashboardLayout>
  )
}

export default Lock
