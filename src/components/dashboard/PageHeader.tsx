import React from 'react'
import { Flex, Heading, Text, Tooltip } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Link from '../elements/LinkElements/Link';

const PageHeader = ({
  header,
  body,
  hasBody = true,
  hasExternalLink = false,
}: {
  header: string
  body: string
  hasBody?: boolean
  hasExternalLink?: boolean}) => {
  return (
    <Flex direction="column" gap="1">
      <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
        {header}{' '}
        {hasExternalLink && (
          <Tooltip
            label="pTokens Dapp- Official bridge interface"
            placement="right"
            hasArrow
            bg="black"
            color="white"
            p="12px"
            borderRadius="12px"
          >
            <Link
              href="https://dapp.ptokens.io/#/swap?asset=iq&from=eth&to=eos"
              isExternal
              color="fadedText4"
            >
              <ExternalLinkIcon
                fontSize="16px"
                fontWeight="light"
                mx="2px"
                mb="2"
                cursor="pointer"
              />
            </Link>
          </Tooltip>
        )}
      </Heading>
      {hasBody && (
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
