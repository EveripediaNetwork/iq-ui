import { Tooltip, Icon } from '@chakra-ui/react'
import React from 'react'
import { RiQuestionLine } from 'react-icons/ri'

const TooltipElement = ({ text }: { text: string }) => {
  return (
    <Tooltip
      color="grayText4"
      placement="top"
      rounded="lg"
      p={5}
      bg="tooltipBg"
      shouldWrapChildren
      hasArrow
      label={text}
    >
      <Icon color="brandText" as={RiQuestionLine} mr={1} />
    </Tooltip>
  )
}

export default TooltipElement
