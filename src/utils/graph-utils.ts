import { useBreakpointValue } from '@chakra-ui/react'

const boxSize = {
  base: { cx: 200, cy: 250 },
  md: { cx: 370, cy: 370 },
  lg: { cx: 200, cy: 260 },
  '2xl': { cx: 260, cy: 330 },
}

const spacing = {
  base: { cx: 85, cy: 120 },
  md: { cx: 160, cy: 170 },
  lg: { cx: 95, cy: 120 },
  '2xl': { cx: 110, cy: 140 },
}

const radius = {
  base: { cx: 40, cy: 90 },
  md: { cx: 70, cy: 140 },
  lg: { cx: 45, cy: 95 },
  '2xl': { cx: 60, cy: 110 },
}

const useBoxSizes = () => {
  return {
    boxSize: useBreakpointValue(boxSize),
    spacing: useBreakpointValue(spacing),
    radius: useBreakpointValue(radius),
  }
}

export default useBoxSizes
