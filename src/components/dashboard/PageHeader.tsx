import React from 'react'
import { Flex, Heading, Text, Tooltip, chakra, Button } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Link from '../elements/LinkElements/Link'
import { PageHeaderPropsType } from '@/types/PageHeader'

const PageHeader = ({ header, body, portfolios }: PageHeaderPropsType) => {
  return (
    <Flex direction="column" gap="1">
      <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
        {header}
      </Heading>
      <Flex gap="3" wrap="wrap">
        {portfolios?.map((portfolio, index) => (
          <Tooltip
            key={index}
            label={portfolio.tooltipLabel}
            placement="top"
            hasArrow
            bg="black"
            color="white"
            p="8px"
            borderRadius="8px"
          >
            <chakra.span>
              <Link href={portfolio.externalLink} isExternal>
                <Button
                  rightIcon={<ExternalLinkIcon />}
                  size="sm"
                  bg="cardBg"
                  color="fadedText4"
                  border="1px solid"
                  borderColor="borderColor"
                  _hover={{ bg: 'hoverBg' }}
                  _active={{ bg: 'gray.300' }}
                  borderRadius="full"
                  px="3"
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {portfolio.label}
                </Button>
              </Link>
            </chakra.span>
          </Tooltip>
        ))}
      </Flex>
      {body && (
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="#D2D2D2"
          fontWeight="medium"
        >
          {body}
        </Text>
      )}
    </Flex>
  )
}

export default PageHeader
