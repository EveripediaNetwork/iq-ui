import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

export const Coinbase = (props: IconProps) => {
  return (
    <Icon width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
      <rect width="48" height="48" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_4323_31262" transform="scale(0.0104167)" />
        </pattern>
        <image
          id="image0_4323_31262"
          width="96"
          height="96"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </Icon>
  )
}
