import { FC, ReactNode } from 'react'
import { Typography as Typo } from '@mui/material'
import { styled } from '@mui/material/styles'

type VariantType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body2' | 'body1'

interface ITypographyBase {
  color?: string
  fontWeight?: number
  children: ReactNode
  variant?: VariantType
  fontFamily?: string
  opacity?: number
}

const TypographyBase: any = styled(Typo, {
  shouldForwardProp: (prop: string) => prop !== 'fontWeight' && prop !== 'color'
})<ITypographyBase>(({ fontWeight, theme, color, fontFamily, opacity }) => ({
  fontWeight,
  whiteSpace: 'pre-line',
  color: color ?? theme.palette.primary.white,
  fontFamily: fontFamily && fontFamily,
  opacity: opacity && opacity
}))

const Typography: FC<ITypographyBase> = ({ variant, children, color, fontWeight, fontFamily, opacity }) => {
  return (
    <TypographyBase variant={variant} component='span' color={color} fontWeight={fontWeight} fontFamily={fontFamily} opacity={opacity}>
      {children}
    </TypographyBase>
  )
}

export default Typography
