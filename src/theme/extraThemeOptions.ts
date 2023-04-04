type ThemeBorderRadiusKeys = 'xSmall' | 'small' | 'medium' | 'large' | 'full'
type ThemeFontWeightsKeys = 'normal' | 'medium' | 'bold' | 'xBold'
type ThemeFontSizesKeys = 'xSmall' | 'small' | 'normal' | 'medium' | 'large' | 'xLarge' | 'xxLarge'
type ThemeBorderRadius = Record<ThemeBorderRadiusKeys, `${number}px` | `${number}%`>
type ThemeFontWeights = Record<ThemeFontWeightsKeys, number>
type ThemeFontSizes = Record<ThemeFontSizesKeys, `${number}px`>

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
    medium: '12px',
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
    xSmall: '16px',
    small: '18px',
    normal: '20px',
    medium: '22px',
    large: '24px',
    xLarge: '40px',
    xxLarge: '48px'
  }
}
