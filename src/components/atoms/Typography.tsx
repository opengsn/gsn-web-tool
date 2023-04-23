import { FC, ReactNode } from 'react'
import { Typography as Typo } from '@mui/material'
import { styled } from '@mui/material/styles'

// type VariantType =
//   | 'body1'
//   | 'body2'
//   | 'button'
//   | 'caption'
//   | 'h1'
//   | 'h2'
//   | 'h3'
//   | 'h4'
//   | 'h5'
//   | 'h6'
//   | 'inherit'
//   | 'overline'
//   | 'subtitle1'
//   | 'subtitle2'

export enum VariantType {
  H1 = 'h1', // 40px
  H2 = 'h2', // 32px
  H3 = 'h3', // 24px
  H4 = 'h4', // 20px
  H5 = 'h5', // 18px
  H6 = 'h6', // 16px
  XSMALL = 'xSmall' // 14px
}

interface ITypographyBase {
  color?: string
  fontWeight?: number
  children: ReactNode
  variant?: VariantType
}

const TypographyBase: any = styled(Typo, {
  shouldForwardProp: (prop: string) => prop !== 'color' && prop !== 'fontWeight'
})<ITypographyBase>(({ color, fontWeight }) => ({
  color: color ?? 'inherit',
  fontWeight: fontWeight ?? 400,
  whiteSpace: 'pre-line'
}))

const Typography: FC<ITypographyBase> = ({ variant, children, color, fontWeight }) => {
  return (
    <TypographyBase variant={variant} component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  )
}

export default Typography
