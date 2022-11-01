import { Flex, Text, FlexProps, Icon, Tooltip } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import React from 'react'

type StakeCardProps = {
  title: string
  subtitle?: string
  value: string
  hasPopUp?: boolean
} & FlexProps

const StakeCard = (props: StakeCardProps) => {
  const { title, value, hasPopUp, subtitle } = props
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
      <Text
        fontSize={{ base: 'sm', md: 'sm', lg: 'md' }}
        color="tooltipColor"
        fontWeight="medium"
      >
        {title}
        {subtitle ? <Text display={{ lg: 'inline' }}>{subtitle}</Text> : ''}
        {hasPopUp ? (
          <>
            <Tooltip
              hasArrow
              label="Annual Percentage Rate. Assumes 4 HiIQ = 1 IQ (i.e 1 IQ locked for 4
          years)"
              bg="bodyBg"
              placement="bottom-start"
              padding="2"
            >
              <Flex
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                pos="relative"
              >
                <Icon
                  color="brandText"
                  cursor="pointer"
                  fontSize={14}
                  as={RiQuestionLine}
                />
              </Flex>
            </Tooltip>
          </>
        ) : (
          ''
        )}
      </Text>
      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}>
        {value}{' '}
      </Text>
    </Flex>
  )
}
export default StakeCard
