import React from 'react'
import { Flex, Heading, Text, Tooltip, chakra } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Link from '../elements/LinkElements/Link'
import { PageHeaderPropsType } from '@/types/PageHeader'

const PageHeader = ({
  header,
  body,
  tooltipLabel,
  externalLink,
}: PageHeaderPropsType) => {
  return (
    <Flex direction="column" gap="1">
      <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
        {header}{' '}
        {externalLink && (
          <Tooltip
            label={tooltipLabel}
            placement="right"
            hasArrow
            bg="black"
            color="white"
            p="12px"
            borderRadius="12px"
          >
            <chakra.span>
              <Link href={externalLink as string} isExternal color="fadedText4">
                <ExternalLinkIcon
                  fontSize="16px"
                  fontWeight="light"
                  mx="2px"
                  mb="2"
                  cursor="pointer"
                />
              </Link>
            </chakra.span>
          </Tooltip>
        )}
      </Heading>
      {body && (
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fadedText4"
          fontWeight="medium"
        >
          {body}
        </Text>
      )}
    </Flex>
  )
}

export default PageHeader
