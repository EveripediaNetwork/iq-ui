import React from 'react'
import type { NextPage } from 'next'
import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  chakra,
  GridItem,
  Divider,
  Image,
  useRadioGroup,
  UseRadioProps,
  useRadio,
  Box,
} from '@chakra-ui/react'
import { Dot } from '@/components/icons/dot'
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Dict } from '@chakra-ui/utils'

const dayData = [
  {
    name: 'Pr',
    amt: 2400,
  },
  {
    name: 'Pr',
    amt: 2210,
  },
  {
    name: 'Pr',
    amt: 2290,
  },
  {
    name: 'Pr',
    amt: 2000,
  },
  {
    name: 'Pr',
    amt: 2181,
  },
  {
    name: 'Pr',
    amt: 2500,
  },
  {
    name: 'Pr',
    amt: 2100,
  },
  {
    name: 'Pr',
    amt: 2400,
  },
  {
    name: 'Pr',
    amt: 2300,
  },
  {
    name: 'Pr',
    amt: 2200,
  },
]

const weekData = [
  {
    name: 'Pr',
    amt: 2600,
  },
  {
    name: 'Pr',
    amt: 2410,
  },
  {
    name: 'Pr',
    amt: 2290,
  },
  {
    name: 'Pr',
    amt: 2700,
  },
  {
    name: 'Pr',
    amt: 2081,
  },
  {
    name: 'Pr',
    amt: 2200,
  },
  {
    name: 'Pr',
    amt: 2500,
  },
]

const CustomTooltip = ({ active, payload }: Dict) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].payload.name} : $${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

const GraphPeriodButton = (props: { label: string } & UseRadioProps) => {
  const { label, ...radioProps } = props
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps)

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Box {...getCheckboxProps()}>
        <Box
          bg={state.isChecked ? 'brandText' : 'transparent'}
          border="solid 1px"
          borderColor={state.isChecked ? 'transparent' : 'divider'}
          color={state.isChecked ? 'white' : 'fadedText3'}
          _hover={{ color: 'white', bg: 'brandText' }}
          fontWeight="500"
          w={{ base: '42px', md: '47px', lg: '50px' }}
          h={{ base: '37px', md: '41px', lg: '44px' }}
          rounded="full"
          p="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.2s ease"
          {...getLabelProps()}
        >
          {label}
        </Box>
      </Box>
    </chakra.label>
  )
}

enum GraphPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

const GRAPH_PERIODS = [
  {
    period: GraphPeriod.DAY,
    label: '1D',
  },
  {
    period: GraphPeriod.WEEK,
    label: '1W',
  },
  {
    period: GraphPeriod.MONTH,
    label: '1M',
  },
  {
    period: GraphPeriod.YEAR,
    label: '1Y',
  },
]

const Home: NextPage = () => {
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: GraphPeriod.WEEK,
    onChange: console.log,
  })

  const graphData = {
    [GraphPeriod.DAY]: dayData,
    [GraphPeriod.WEEK]: weekData,
  }[value]

  return (
    <DashboardLayout>
      <Stack h="full" mb="4.375em" spacing={{ base: 7, md: 5, lg: 6 }}>
        <Flex
          gap={{ lg: '15' }}
          px={{ base: 3, md: '5' }}
          py={{ base: 3, md: 7, lg: '2.5' }}
          pr={{ md: '6.25em' }}
          bg="cardBg"
          border="solid 1px"
          borderColor="divider"
          h="fit-content"
          rounded="lg"
          align={{ base: 'start', lg: 'center' }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Stack pt="5" order={{ base: 1, lg: 0 }}>
            <Heading fontSize={{ md: 'xl', lg: '2xl' }}>
              Welcome to the IQ Dashboard
            </Heading>
            <Text fontSize={{ base: 'sm', lg: 'md' }}>
              The IQ token is a multichain token that powers the Everipedia
              ecosystem of dapps and features. IQ token is a DeFi token that can
              be staked for hiIQ to earn rewards + yields. You can bridge your
              token from all chains IQ circulares on, using our bridge UI, and
              lots more.
            </Text>
          </Stack>
          <BraindaoLogo3 h="8.125em" w="unset" />
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
          <Stat>
            <Flex
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
                Market Cap
              </StatLabel>
              <chakra.div
                ml={{ base: 'auto', md: 'initial' }}
                sx={{
                  '.chakra-stat__help-text': {
                    h: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    $55.89M
                  </chakra.span>
                  <StatHelpText position="relative">
                    <StatArrow type="increase" />
                    <chakra.span
                      color="green"
                      fontSize={{ base: 'xs', md: 'inherit' }}
                      mr={{ base: 1, md: 0 }}
                    >
                      0.09%
                    </chakra.span>
                  </StatHelpText>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
          <Stat>
            <Flex
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
                Circulating supply
              </StatLabel>
              <chakra.div ml={{ base: 'auto', md: 'initial' }}>
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    12B IQ
                  </chakra.span>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
          <Stat>
            <Flex
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
                {' '}
                24hours volume
              </StatLabel>
              <chakra.div ml={{ base: 'auto', md: 'initial' }}>
                <StatNumber display="flex" justifyContent="center">
                  <chakra.span
                    fontSize={{ base: 'md', md: '3xl', lg: '4xl', xl: '5xl' }}
                    order={{ base: '1', md: 'unset' }}
                  >
                    $1.58M
                  </chakra.span>
                  <StatHelpText position="relative">
                    <StatArrow type="decrease" />
                    <chakra.span
                      color="red"
                      fontSize={{ base: 'xs', md: 'inherit' }}
                      mr={{ base: 1, md: 0 }}
                    >
                      15.50%
                    </chakra.span>
                  </StatHelpText>
                </StatNumber>
              </chakra.div>
            </Flex>
          </Stat>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ lg: '4' }}>
          <GridItem
            colSpan={[2]}
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            py={{ base: '13px', md: '22px', lg: '6' }}
            px={{ base: '11px', md: '18px', lg: 5 }}
          >
            <Flex align="center">
              <Image
                src="https://s3-alpha-sig.figma.com/img/2219/e74e/930c697246878a5e5a543a72188b698d?Expires=1659916800&Signature=Y~ivTCurF9I4vmaBTKv15D95HwNEx6Sl7dFhRGi4oQdiggkRPFonw7bFUOH0AzF51NVJZX4SsRe6ScpxmTzAP7nfVP4ksjsnp9V4skKqZbLBb6pz7eG9Ex4hDUYQvajpUKf0QE45DQe1dlxDDff5X-y~PwpQfYhnyKTRAFu96Ot-bzzm8IeRWZiAxfvjfbgFCG1caBhkK1zd0RnwnCE8cEjIdto1i9vP9g0-48Bp4ZbQGZzDwH9Ass-vNbZzDcFL7Q9A-YFeGzAcZTSAxm5FErEyXODL2nUra-eW1U~Do97sB7lOxAYEIJorjH9WecVMDg55djA8JXltYzkBPfkoQw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                boxSize={{ base: '22px', md: '9', lg: 10 }}
              />
              <Text
                fontSize={{ base: '14px', md: '21px', lg: '24px' }}
                fontWeight="600"
                ml="2"
              >
                Everipedia (IQ) price
              </Text>
            </Flex>
            <Flex mt="6px">
              <Text
                fontSize={{ base: '18px', md: '27px', lg: '30px' }}
                fontWeight={{ base: 700, md: '600' }}
              >
                $0.0046
              </Text>
              <chakra.span
                fontSize={{ base: '8px', md: '10px', lg: '12px' }}
                fontWeight="600"
                color="green.600"
              >
                +1.34%
              </chakra.span>
              <chakra.span
                fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                fontWeight="400"
                color="fadedText2"
                ml="auto"
              >
                $0.0048
              </chakra.span>
            </Flex>
            <Flex
              mt="27px"
              sx={{
                '.recharts-surface, .recharts-wrapper': {
                  w: 'full',
                },
                '.recharts-tooltip-cursor, .recharts-area-curve': {
                  color: 'brandText',
                  stroke: 'currentColor',
                },
                '.gradientStart': {
                  color: 'brandText',
                  _dark: {
                    color: 'transparent',
                  },
                },
                '.gradientStop': {
                  color: 'white',
                  _dark: {
                    color: 'transparent',
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={graphData}>
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        className="gradientStart"
                        offset="5%"
                        stopColor="currentColor"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="60%"
                        className="gradientStop"
                        stopColor="currentColor"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    className="area"
                    activeDot={{ r: 4 }}
                    type="monotone"
                    dataKey="amt"
                    stroke="#FF1A88"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Flex>
            <Flex>
              <chakra.span
                fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                fontWeight="400"
                color="fadedText2"
                ml="auto"
              >
                $0.0045
              </chakra.span>
            </Flex>
            <Flex
              mt={{ md: '6px' }}
              gap={{ base: '6', md: '10', lg: '12' }}
              {...getRootProps()}
            >
              {GRAPH_PERIODS.map(btn => {
                return (
                  <GraphPeriodButton
                    key={btn.period}
                    label={btn.label}
                    {...getRadioProps({ value: btn.period })}
                  />
                )
              })}
            </Flex>
          </GridItem>
          <Flex
            direction={{ base: 'row', lg: 'column' }}
            gap="10"
            py="12"
            px={{ base: 4, md: 14, lg: 0 }}
            rounded="lg"
            border="solid 1px "
            borderColor="divider"
            align="center"
            justify="space-evenly"
          >
            <Stack align="center" spacing="4">
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                All-time high
              </Text>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                $0.072{' '}
                <chakra.sup
                  fontSize={{ base: 'xx-small', md: 'md' }}
                  color="red.500"
                >
                  -93.61%
                </chakra.sup>
              </Text>
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                16 Jul 2018 <Dot /> 08:35
              </Text>
            </Stack>
            <chakra.div h="full" w="fit-content">
              <Divider
                w="30"
                borderColor="divider"
                display={{ base: 'none', lg: 'inherit' }}
              />
              <Divider
                borderColor="divider"
                orientation="vertical"
                display={{ lg: 'none' }}
              />
            </chakra.div>
            <Stack align="center" spacing="4">
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                All-time low
              </Text>
              <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
                $0.00063
                <chakra.sup
                  fontSize={{ base: 'xx-small', md: 'md' }}
                  color="red.500"
                >
                  +634.21%
                </chakra.sup>
              </Text>
              <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
                16 Jul 2018 <Dot /> 08:35
              </Text>
            </Stack>
          </Flex>
        </SimpleGrid>
      </Stack>
    </DashboardLayout>
  )
}

export default Home
