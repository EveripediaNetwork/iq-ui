import { Flex, Text, FlexProps, Icon, Tooltip } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import React from 'react'

type StakeCardProps = {
  title: string
  value: string
  subtitle?: string
  hasPopUp?: boolean
  label?: string
} & FlexProps

const StakeCard = (props: StakeCardProps) => {
  const { title, value, hasPopUp, subtitle, label } = props
  return (
    <Flex
      direction="column"
      gap="6px"
      align="center"
      px={{ base: '8px', lg: '10px' }}
      py={{ base: '10px', lg: '7px' }}
      textAlign="center"
      {...props}
      title=""
    >
      <Flex>
        <Text
          fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
          color="tooltipColor"
          fontWeight="medium"
        >
          {title}
          {subtitle ? (
            <Text display={{ base: 'block', lg: 'inline' }} pl="1">
              {subtitle}
            </Text>
          ) : (
            ''
          )}

          {hasPopUp ? (
            <>
              <Tooltip
                hasArrow
                label={label}
                placement="bottom"
                color="grayText4"
                rounded="lg"
                p={5}
                bg="tooltipBg"
              >
                <Flex
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  as="span"
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
      </Flex>
      <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}>
        {value}{' '}
      </Text>
    </Flex>
  )
}
export default StakeCard
