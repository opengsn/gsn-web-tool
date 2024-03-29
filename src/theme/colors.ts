import { PaletteOptions } from '@mui/material'

type HEX = `#${string}`
type IPrimary = Record<primaryColors, HEX | string>

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

type primaryColors =
  | 'cardBG'
  | 'mainCTA'
  | 'mainBG'
  | 'main'
  | 'white'
  | 'cardOutline'
  | 'mainBrightWhite'
  | 'chipBGSuccess'
  | 'chipBGPending'
  | 'chipBGError'
  | 'mainPos'
  | 'chipTextError'
  | 'chipTextPending'
  | 'tableRowHover'
  | 'copyButtonBG'
  | 'relayHubBG'
  | 'alertInfoBG'
  | 'alertWarningBG'
  | 'mainCTADisabled'

declare module '@mui/material/styles' {
  interface PaletteColor {
    cardBG: string
    mainCTA: string
    mainBG: string
    white: string
    cardOutline: string
    mainBrightWhite: string
    chipBGSuccess: string
    chipBGPending: string
    chipBGError: string
    mainPos: string
    chipTextError: string
    chipTextPending: string
    tableRowHover: string
    copyButtonBG: string
    relayHubBG: string
    alertInfoBG: string
    alertWarningBG: string
    mainCTADisabled: string
  }
}

const primary: IPrimary = {
  main: '#000000',
  cardBG: '#22282C',
  mainCTA: '#FF971D',
  mainBG: '#0F1113',
  white: '#FFFFFF',
  cardOutline: '#ffffff33',
  mainBrightWhite: '#ffffff99',
  chipBGSuccess: '#01b47e40',
  chipBGPending: '#ffc10740',
  chipBGError: '#f8474740',
  mainPos: '#01B47E',
  chipTextError: '#F84747',
  chipTextPending: '#FFC107',
  tableRowHover: '#2D3337',
  copyButtonBG: '#84888A',
  relayHubBG: '#383D41',
  alertInfoBG: '#47edf826',
  alertWarningBG: '#ff971d26',
  mainCTADisabled: '#ff971d66'
}

// https://mui.com/material-ui/customization/palette/
export const palette: PaletteOptions = {
  primary
}

export default colors
