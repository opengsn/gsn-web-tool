type ThemeBorderRadiusKeys = 'xSmall' | 'small' | 'medium' | 'large' | 'full'
type ThemeFontWeightsKeys = 'normal' | 'medium' | 'bold' | 'xBold'
type ThemeBorderRadius = Record<ThemeBorderRadiusKeys, `${number}px` | `${number}%`>
type ThemeFontWeights = Record<ThemeFontWeightsKeys, number>

declare module '@mui/material/styles' {
  interface Theme extends ExtraThemeOptions {}
}

export interface ExtraThemeOptions {
  borderRadius: ThemeBorderRadius
  fontWeights: ThemeFontWeights
}

export const extraThemeOptions: ExtraThemeOptions = {
  borderRadius: {
    xSmall: '4px',
    small: '6px',
    medium: '12px',
    large: '16px',
    full: '50%'
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
    xBold: 900
  }
}
