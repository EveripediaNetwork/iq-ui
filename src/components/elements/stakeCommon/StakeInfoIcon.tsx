import Icon from '@chakra-ui/icon'
import React from 'react'
import { RiQuestionLine } from 'react-icons/ri'

const StakeInfoIcon = ({ handler }: { handler: (value: boolean) => void }) => {
  return (
    <Icon
      color="brandText"
      cursor="pointer"
      onClick={() => handler(true)}
      fontSize={20}
      as={RiQuestionLine}
    />
  )
}

export default StakeInfoIcon
