import { Palette } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { extraThemeOptions } from './extraThemeOptions'

export const typography: TypographyOptions | ((palette: Palette) => TypographyOptions) = {
  fontFamily: `'Inter', sans-serif`,
  h1: {
    fontSize: extraThemeOptions.fontSizes.xLarge
  },
  h2: {
    fontSize: extraThemeOptions.fontSizes.large
  },
  h3: {
    fontSize: extraThemeOptions.fontSizes.medium
  },
  h4: {
    fontSize: extraThemeOptions.fontSizes.small
  },
  h5: {
    fontSize: extraThemeOptions.fontSizes.xSmall
  }
}
