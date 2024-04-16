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

const ErrorPage = () => {
  return (
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
        <Text
          textAlign="center"
          fontSize={{ base: 'md', md: '2xl' }}
          maxW="900px"
          position="relative"
          top={{
            base: '0',
            md: '-60px',
            xl: '-80px',
          }}
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
    </Container>
  )
}
export default ErrorPage
