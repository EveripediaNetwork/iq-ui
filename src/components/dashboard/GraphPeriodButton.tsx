import { UseRadioProps, useRadio, Box, chakra } from '@chakra-ui/react'
import React from 'react'

const GraphPeriodButton = (props: { label: string } & UseRadioProps) => {
  const { label, ...radioProps } = props
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps)

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Box {...getCheckboxProps()}>
        <Box
          bg={state.isChecked ? 'brandText' : 'transparent'}
          border="solid 1px"
          borderColor={state.isChecked ? 'transparent' : 'divider'}
          color={state.isChecked ? 'white' : 'fadedText3'}
          _hover={{ color: 'white', bg: 'brandText' }}
          fontWeight="500"
          w={{ base: '42px', md: '47px', lg: '50px' }}
          h={{ base: '37px', md: '41px', lg: '44px' }}
          rounded="full"
          p="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.2s ease"
          {...getLabelProps()}
        >
          {label}
        </Box>
      </Box>
    </chakra.label>
  )
}

export default GraphPeriodButton
