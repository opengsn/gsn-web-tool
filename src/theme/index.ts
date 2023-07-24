import { createTheme } from '@mui/material'
import { extraThemeOptions } from './extraThemeOptions'
import { palette } from './colors'
import { typography } from './typography'
export { default as colors } from './colors'

const muiSpacingToPixelIndex = 2

export const spacingSizeArray = [0, 1, 2, 3, 4, 5, 8, 10, 11, 15]

export const theme = createTheme(
  {
    typography,
    palette,
    spacing: (value: number | string) => {
      if (value === 'auto') {
        return 'auto'
      }

      if (spacingSizeArray.includes(value as number)) {
        return +value * muiSpacingToPixelIndex
      }

      throw new Error(`Spacing with ${value} value is not from the spacing system`)
    },
    components: {
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: 'black'
          }
        }
      }
    }
  },
  extraThemeOptions
)
