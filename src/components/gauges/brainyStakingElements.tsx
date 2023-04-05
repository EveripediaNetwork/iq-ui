import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
} from '@chakra-ui/react'
import React from 'react'

export const NftImage = ({
  nftURI,
  action,
}: {
  nftURI: string
  action: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const fallbackImage = useColorModeValue(
    '/images/nft-bg-light.png',
    '/images/nft-bg-dark.png',
  )

  return (
    <Flex
      pt={2}
      mb={5}
      alignItems="center"
      direction="column"
      w={[250, 370]}
      background="hoverBg"
      borderRadius={8}
      border="solid 1px "
      borderColor="divider"
      px={2}
    >
      <Image src={nftURI} borderRadius="12px" fallbackSrc={fallbackImage} />
      <Box w="full" px={{ base: 0 }} py={2}>
        <Input
          onChange={action}
          px={[3, 4]}
          backgroundColor="subMenuBg"
          placeholder="Input Nft ID"
          w="full"
          border="none"
        />
      </Box>
    </Flex>
  )
}

export const StakingTabs = ({
  arrayNum,
  texts,
  firstElement,
  secondElement,
}: {
  arrayNum: number
  texts: string[]
  firstElement: JSX.Element
  secondElement: JSX.Element
}) => {
  return (
    <Tabs variant="unstyled" w="full">
      {arrayNum > 0 && (
        <TabList display="flex" justifyContent="center" w="full">
          {texts.map((item, i) => {
            return (
              <Tab
                key={i}
                px={{ base: 3, md: 4 }}
                border="1px solid"
                fontWeight={{ md: 'bold' }}
                fontSize="xs"
                borderColor="divider2"
                borderLeftRadius={i === 0 ? '5' : '0'}
                borderRightRadius={i !== 0 ? '5' : '0'}
                borderRightColor={i === 0 ? 'transparent' : ''}
                borderLeftColor={i !== 0 ? 'transparent' : ''}
                _selected={{ color: 'white', bg: 'brandText' }}
              >
                {item}
              </Tab>
            )
          })}
        </TabList>
      )}
      <TabPanels display="flex" justifyContent="center">
        <TabPanel p={0} pt={6}>
          {firstElement}
        </TabPanel>
        <TabPanel p={0} mt={7}>
          <VStack rowGap={6}>{secondElement}</VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const StakingLockPeriod = ({
  lockPeriod,
  sliderAction,
  InputAction,
  leftAction,
  rightAction,
  isConnected,
}: {
  lockPeriod: number
  sliderAction: (val: number) => void
  InputAction: (e: React.ChangeEvent<HTMLInputElement>) => void
  leftAction: () => void
  rightAction: () => void
  isConnected: boolean
}) => {
  return (
    <Flex
      p={5}
      mb={3}
      borderRadius="6px"
      border="solid 1px "
      borderColor="divider"
      direction="column"
      justifyContent="space-around"
      w="full"
    >
      <Text fontSize="xs">Lock period (days)</Text>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        w="100%"
      >
        <Slider
          aria-label="slider-ex-2"
          colorScheme="pink"
          defaultValue={0}
          min={7}
          ml={2}
          max={365}
          value={lockPeriod}
          onChange={sliderAction}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Flex mt={{ base: '3', md: '0' }} ml={4} align="end">
          <InputGroup bg="lightCard" size="xs">
            <InputLeftAddon
              cursor="pointer"
              onClick={leftAction}
              bg="lightCard"
              color="grayText4"
            >
              <Text>-</Text>
            </InputLeftAddon>
            <Input
              max={365}
              value={lockPeriod}
              w={{ base: 'full', md: '10' }}
              onChange={InputAction}
              color="grayText4"
              disabled={!isConnected}
              bg="lightCard"
              textAlign="center"
            />
            <InputRightAddon
              cursor="pointer"
              color="grayText4"
              onClick={rightAction}
              bg="lightCard"
            >
              <Text>+</Text>
            </InputRightAddon>
          </InputGroup>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default StakingLockPeriod
