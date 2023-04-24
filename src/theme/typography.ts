import { CSSProperties } from 'react'
import { Palette } from '@mui/material/styles/createPalette'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { extraThemeOptions } from './extraThemeOptions'

declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    h1: CSSProperties
    h2: CSSProperties
    h3: CSSProperties
    h4: CSSProperties
    h5: CSSProperties
    h6: CSSProperties
    xSmall: CSSProperties
  }
}

// flags for allowing usage of variant props (overrides defaults true value)
declare module '@mui/material/Typography' {}

export const typography: TypographyOptions | ((palette: Palette) => TypographyOptions) = {
  h1: {
    fontSize: extraThemeOptions.fontSizes.xxLarge
  },
  h2: {
    fontSize: extraThemeOptions.fontSizes.xLarge
  },
  h3: {
    fontSize: extraThemeOptions.fontSizes.large
  },
  h4: {
    fontSize: extraThemeOptions.fontSizes.medium
  },
  h5: {
    fontSize: extraThemeOptions.fontSizes.normal
  },
  h6: {
    fontSize: extraThemeOptions.fontSizes.small
  },
  xSmall: {
    fontSize: extraThemeOptions.fontSizes.xSmall
  }
}
