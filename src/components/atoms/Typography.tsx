import { FC, ReactNode } from 'react'
import { Typography as Typo } from '@mui/material'
import { styled } from '@mui/material/styles'

type VariantType =
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'inherit'
  | 'overline'
  | 'subtitle1'
  | 'subtitle2'

interface ITypographyBase {
  color?: string
  fontWeight?: number
  children: ReactNode
  variant?: VariantType
}

const TypographyBase: any = styled(Typo, {
  shouldForwardProp: (prop: string) => prop !== 'fontWeight' && prop !== 'color'
})<ITypographyBase>(({ fontWeight, theme, color }) => ({
  fontWeight,
  whiteSpace: 'pre-line',
  color: color ?? theme.palette.primary.white
}))

const Typography: FC<ITypographyBase> = ({ variant, children, color, fontWeight }) => {
  return (
    <TypographyBase variant={variant} component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  )
}

export default Typography
