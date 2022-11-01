import { Flex, Text, FlexProps, Icon, Tooltip, Box } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import React from 'react'

type StakeCardProps = {
  title: string
  value: string
  hasPopUp?: boolean
} & FlexProps

const StakeCard = (props: StakeCardProps) => {
  const { title, value, hasPopUp } = props
  return (
    <Flex
      direction="column"
      gap="6px"
      align="center"
      px={{ base: '8px', lg: '10px' }}
      py={{ base: '10px', lg: '7px' }}
      textAlign="center"
      {...props}
    >
      <Flex>
        <Text
          fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
          color="tooltipColor"
          fontWeight="medium"
        >
          {title}
        </Text>
        {hasPopUp ? (
          <>
            <Tooltip
              hasArrow
              label="Annual Percentage Rate. Assumes 4 HiIQ = 1 IQ (i.e 1 IQ locked for 4
          years)"
              bg="bodyBg"
              placement="bottom"
              padding="2"
            >
              <Box as="span" pos="relative">
                <Icon
                  ml={2}
                  color="brandText"
                  cursor="pointer"
                  fontSize={14}
                  as={RiQuestionLine}
                />
              </Box>
            </Tooltip>
          </>
        ) : (
          ''
        )}
      </Flex>
      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}>
        {value}{' '}
      </Text>
    </Flex>
  )
}
export default StakeCard
