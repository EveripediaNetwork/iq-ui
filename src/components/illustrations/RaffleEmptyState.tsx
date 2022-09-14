import { Icon } from '@chakra-ui/react'
import React from 'react'

export const RaffleEmptyState = ({ colorMode }: { colorMode: string }) => {
  return (
    <Icon width="297" height="383" viewBox="0 0 297 383" fill="none">
      <circle
        cx="148.5"
        cy="148.627"
        r="148.5"
        fill={colorMode === 'light' ? '#F1F1F1' : '#718096'}
      />
      <rect
        x="88.2559"
        y="143.435"
        width="149.538"
        height="207.692"
        rx="8"
        transform="rotate(2.5 88.2559 143.435)"
        fill={colorMode === 'light' ? '#EEEEEE' : '#2D3748'}
        stroke={colorMode === 'light' ? '#999999' : 'none'}
      />
      <rect
        x="89.2113"
        y="144.477"
        width="147.538"
        height="205.692"
        rx="7"
        transform="rotate(2.5 89.2113 144.477)"
        stroke="white"
        strokeOpacity="0.16"
        strokeWidth="2"
      />
      <rect
        x="6.14062"
        y="135.214"
        width="149.538"
        height="207.692"
        rx="8"
        transform="rotate(-7.5 6.14062 135.214)"
        fill="#2D3748"
      />
      <rect
        x="5.01865"
        y="134.353"
        width="151.538"
        height="209.692"
        rx="9"
        transform="rotate(-7.5 5.01865 134.353)"
        strokeOpacity="0.16"
        strokeWidth="2"
        stroke={colorMode === 'light' ? '#999999' : 'white'}
        fill={colorMode === 'light' ? '#FAFAFA' : 'none'}
      />

      <path
        d="M7.18483 143.145C6.60813 138.765 9.6917 134.746 14.0722 134.169L146.468 116.739C150.849 116.162 154.867 119.246 155.444 123.626L160.635 163.055L12.3758 182.574L7.18483 143.145Z"
        fill={colorMode === 'light' ? '#EEEEEE' : '#1A202C'}
      />
      <rect
        x="186.645"
        y="121.924"
        width="6.23077"
        height="20.7692"
        rx="3"
        transform="rotate(82.5 186.645 121.924)"
        fill={colorMode === 'light' ? '#999999' : '#1A202C'}
      />
      <rect
        x="129.74"
        y="87.5184"
        width="6.23077"
        height="20.7692"
        rx="3"
        transform="rotate(-7.5 129.74 87.5184)"
        fill={colorMode === 'light' ? '#999999' : '#1A202C'}
      />
      <rect
        x="166.25"
        y="93.1862"
        width="6.23077"
        height="20.7692"
        rx="3"
        transform="rotate(37.5 166.25 93.1862)"
        fill={colorMode === 'light' ? '#999999' : '#1A202C'}
      />
      <rect
        x="27.877"
        y="188.913"
        width="120.462"
        height="8.30769"
        rx="2"
        transform="rotate(-7.5 27.877 188.913)"
        fill={colorMode === 'light' ? '#DCDCDC' : '#A0AEC0'}
      />
      <rect
        x="33.2969"
        y="230.096"
        width="120.462"
        height="8.30769"
        rx="2"
        transform="rotate(-7.5 33.2969 230.096)"
        fill={colorMode === 'light' ? '#DCDCDC' : '#A0AEC0'}
      />
      <rect
        x="38.7168"
        y="271.279"
        width="120.462"
        height="8.30769"
        rx="2"
        transform="rotate(-7.5 38.7168 271.279)"
        fill={colorMode === 'light' ? '#DCDCDC' : '#A0AEC0'}
      />
      <rect
        x="30.0469"
        y="205.386"
        width="43.6154"
        height="8.30769"
        rx="2"
        transform="rotate(-7.5 30.0469 205.386)"
        fill={colorMode === 'light' ? '#EEEEEE' : '#718096'}
      />
      <rect
        x="35.4648"
        y="246.569"
        width="43.6154"
        height="8.30769"
        rx="2"
        transform="rotate(-7.5 35.4648 246.569)"
        fill={colorMode === 'light' ? '#EEEEEE' : '#718096'}
      />
      <rect
        x="40.8887"
        y="287.752"
        width="43.6154"
        height="8.30769"
        rx="2"
        transform="rotate(-7.5 40.8887 287.752)"
        fill={colorMode === 'light' ? '#EEEEEE' : '#718096'}
      />
    </Icon>
  )
}
