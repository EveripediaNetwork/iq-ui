'use client'
import { Box, Container, Link, VStack, Text, Image } from '@chakra-ui/react'

const ErrorPage = () => {
  return (
    <Container maxW="6xl">
      <VStack align="center" spacing={{ base: 8, md: 20 }}>
        <Box
          position="relative"
          flex="1"
          py={{ base: 16, md: 20 }}
          px={{ base: 10, lg: 2 }}
        >
          <Image
            alt="Lochness"
            src="/images/error-lochness.svg"
            h="600px"
            w="600px"
          />
        </Box>
        <Text
          textAlign={{ base: 'center', lg: 'left' }}
          fontSize={{ base: 'md', md: '2xl', lg: 'xl' }}
        >
          {'404 CTA text'}
        </Text>
        <Link href="/">Take me home</Link>
      </VStack>
    </Container>
  )
}
export default ErrorPage
