import {
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Flex,
  Heading,
  Spacer,
  VStack,
  chakra,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { RiQuestionLine } from 'react-icons/ri'
import IncreaseLockTime from './IncreaseLockTime'
import StakeIQ from './StakeIQ'
import * as Humanize from 'humanize-plus'

type StakeBoxprops = {
  userTotalIQLocked: number
  setOpenStakingInfo: React.Dispatch<React.SetStateAction<boolean>>
  lockEndDate: Date | undefined
  exchangeRate: number
}

export const StakeBox = (props: StakeBoxprops) => {
  const { setOpenStakingInfo, userTotalIQLocked, lockEndDate, exchangeRate } =
    props

  const tabs = {
    'Stake more IQ': {
      label: 'Stake more IQ',
      borderLeftRadius: '5',
      borderRightColor: 'transparent',
    },
    'Increase Stake time': {
      label: 'Increase Stake time',
      borderRightRadius: '5',
      borderLeftColor: 'transparent',
    },
  }

  return (
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
          Stake IQ
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
      {userTotalIQLocked > 0 && typeof lockEndDate !== 'number' && (
        <Box
          alignSelf="center"
          rounded="md"
          width={{ md: 355 }}
          bg="lightCard"
          textAlign="center"
          p={4}
        >
          <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
            You have Staked a total of{' '}
            <chakra.span fontWeight="bold">
              {Humanize.formatNumber(userTotalIQLocked, 2)}
            </chakra.span>{' '}
            IQ. Expiring on{' '}
            <chakra.span fontWeight="bold">
              {lockEndDate?.toUTCString()}
            </chakra.span>
          </Text>
        </Box>
      )}
      <Tabs variant="unstyled">
        {userTotalIQLocked > 0 && (
          <TabList display="flex" justifyContent="center">
            {Object.values(tabs).map(({ label, ...tabProps }) => (
              <Tab
                key={label}
                px={{ base: 3, md: 4 }}
                border="1px solid"
                fontWeight={{ md: 'bold' }}
                fontSize="xs"
                borderColor="divider2"
                _selected={{ color: 'white', bg: 'brandText' }}
                {...tabProps}
              >
                {label}
              </Tab>
            ))}
          </TabList>
        )}
        <TabPanels>
          <TabPanel p={0} pt={6}>
            <StakeIQ exchangeRate={exchangeRate} />
          </TabPanel>
          <TabPanel p={0} mt={7}>
            <VStack rowGap={6}>
              <IncreaseLockTime />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
