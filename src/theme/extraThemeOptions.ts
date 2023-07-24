type ThemeBorderRadiusKeys = 'xSmall' | 'small' | 'medium' | 'large' | 'full'
type ThemeFontWeightsKeys = 'normal' | 'medium' | 'bold' | 'xBold'
type ThemeFontSizesKeys = 'xLarge' | 'large' | 'medium' | 'small' | 'xSmall'
type ThemeBorderRadius = Record<ThemeBorderRadiusKeys, `${number}px` | `${number}%`>
type ThemeFontWeights = Record<ThemeFontWeightsKeys, number>
type ThemeFontSizes = Record<ThemeFontSizesKeys, string>

declare module '@mui/material/styles' {
  interface Theme extends ExtraThemeOptions {}
}

export interface ExtraThemeOptions {
  borderRadius: ThemeBorderRadius
  fontWeights: ThemeFontWeights
  fontSizes: ThemeFontSizes
}

export const extraThemeOptions: ExtraThemeOptions = {
  borderRadius: {
    xSmall: '4px',
    small: '6px',
    medium: '10px',
    large: '16px',
    full: '50%'
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
    xBold: 900
  },
  fontSizes: {
    xLarge: '30px',
    large: '24px',
    medium: '18px',
    small: '14px',
    xSmall: '12px'
  }
}
