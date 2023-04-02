import { createTheme } from '@mui/material'
import { extraThemeOptions } from './extraThemeOptions'
import { typography } from './typography'
export { default as colors } from './colors'

export const spacingSizeArray = [0, 1, 2, 3, 4, 8]

export const theme = createTheme(
  {
    typography,
    spacing: (value: number | string) => {
      if (value === 'auto') {
        return 'auto'
      }

      if (spacingSizeArray.includes(value as number)) {
        return value
      }
      throw new Error(`Spacing with ${value} value is not from the spacing system`)
    }
  },
  extraThemeOptions
)