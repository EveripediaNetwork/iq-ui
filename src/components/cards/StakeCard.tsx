import { Flex, Text, FlexProps, Icon, Tooltip } from '@chakra-ui/react'
import { RiQuestionLine } from 'react-icons/ri'
import React from 'react'

type StakeCardProps = {
  title: string
  value: string
  subtitle?: string
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
            <Text display={{ base: 'block', lg: 'inline' }}>{subtitle}</Text>
          ) : (
            ''
          )}

          {hasPopUp ? (
            <>
              <Tooltip
                hasArrow
                label={`Assumes 4 HiIQ = 1 IQ (i.e 1 IQ locked for 4 years). 
                Calculated based on the current IQ emissions rate (does not factor in future halvenings). \n 
                IQ emissions halve annually on Nov. 1.`}
                bg="bodyBg"
                placement="bottom"
                padding="2"
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
