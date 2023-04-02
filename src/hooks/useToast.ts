import { useToast } from '@chakra-ui/react'

export const useReusableToast = () => {
  const toast = useToast()
  const showToast = (msg: string, status: 'error' | 'success') => {
    toast({
      title: msg,
      position: 'top-right',
      isClosable: true,
      status,
    })
  }
  return { showToast } as const
}
