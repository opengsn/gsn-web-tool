import { PaletteOptions } from '@mui/material'

const colors = {
  black: '#000000',
  azure: '#D8E5FF',
  grey: '#A7A7A7',
  lightGreen: '#EDF7ED',
  red: '#dc3545',
  white: '#FFFFFF',
  cardBackground: '#00000020',
  warning: '#ffc107',
  success: '#2E7D32',
  cardBG: '#22282C',
  mainCTA: '#FF971D',
  mainBG: '#0F1113'
}

type HEX = `#${string}`

type primaryColors = 'cardBG' | 'mainCTA' | 'mainBG' | 'main' | 'white' | 'cardOutline' | 'mainBrightWhite' | 'chipBG'

type IPrimary = Record<primaryColors, HEX | string>

const primary: IPrimary = {
  main: '#000000',
  cardBG: '#22282C',
  mainCTA: '#FF971D',
  mainBG: '#0F1113',
  white: '#FFFFFF',
  cardOutline: '#ffffff33',
  mainBrightWhite: '#ffffff99',
  chipBG: '#01b47e40'
}

declare module '@mui/material/styles' {
  interface PaletteColor {
    cardBG: string
    mainCTA: string
    mainBG: string
    white: string
    cardOutline: string
    mainBrightWhite: string
    chipBG: string
  }
}

// https://mui.com/material-ui/customization/palette/
export const palette: PaletteOptions = {
  primary
}

export default colors
