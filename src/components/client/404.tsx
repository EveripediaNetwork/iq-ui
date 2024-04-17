'use client'

import {
  Box,
  Container,
  Link,
  VStack,
  Text,
  Image,
  Button,
} from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import chakraTheme from '@/theme'
import ColorMode from '@/components/chakra/ColorMode'

const ErrorPage = () => {
  return (
    <ChakraProvider resetCSS theme={chakraTheme}>
      <ColorMode />
      <Container maxW="6xl">
        <VStack align="center" spacing={4}>
          <Box
            flex="1"
            py={2}
            px={{ base: 10, lg: 2 }}
            className="error-lochness"
          >
            <Image
              alt="Lochness"
              src="/images/error-lochness.svg"
              h="600px"
              w="600px"
            />
          </Box>
          <VStack
            align="center"
            position="relative"
            spacing={4}
            top={{
              sm: '-160px',
              base: '-220px',
              md: '-160px',
              xl: '-120px',
            }}
          >
            <Text
              textAlign="center"
              fontSize={{ base: 'md', md: 'xl' }}
              fontWeight="medium"
              maxW={{ base: '90%', lg: '70%' }}
            >
              {
                'We apologize for the inconvenience, but the page you are attempting to access is currently unavailable. Please return to our homepage to continue browsing.'
              }
            </Text>
            <Button>
              <Link style={{ textDecoration: 'none' }} href="/">
                Take me home
              </Link>
            </Button>
          </VStack>
        </VStack>
      </Container>
    </ChakraProvider>
  )
}
export default ErrorPage
