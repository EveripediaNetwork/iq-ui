import { Flex, Text, FlexProps, Icon, Tooltip, chakra, Box, Center } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import React from 'react'

type StakeCardProps = {
  title: string
  value: string
  hasPopUp?: boolean
  label?: string
  isLastItem?: boolean
} & FlexProps

const StakeCard = (props: StakeCardProps) => {
  const { title, value, hasPopUp, label, isLastItem } = props
  return (
    <Flex
      direction="column"
      gap="6px"
      align="center"
      px={{ base: '8px', lg: '10px' }}
      textAlign="center"
      {...props}
      title=""
      ml={{ base: isLastItem ? '50%' : 'none', md: '0' }}
      w="full"
    >
      <Box>
        <Flex>
          <Center flex={1}>
            <Text
              fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
              color="tooltipColor"
              fontWeight="medium"
              textAlign="center"
            >
              {title}{' '}
              <chakra.span>
                {hasPopUp && (
                  <Tooltip
                    hasArrow
                    label={label}
                    placement="bottom"
                    color="grayText4"
                    rounded="lg"
                    bg="tooltipBg"
                  >
                    <Icon
                      color="brandText"
                      cursor="pointer"
                      fontSize={14}
                      as={RiQuestionLine}
                      mt="-2px"
                    />
                  </Tooltip>
                )}
              </chakra.span>
            </Text>
          </Center>
        </Flex>
        <Text
          textAlign="center"
          fontWeight="semibold"
          fontSize={{ base: 'xs', lg: 'xl' }}
        >
          {value}
        </Text>
      </Box>
    </Flex>
  )
}
export default StakeCard
