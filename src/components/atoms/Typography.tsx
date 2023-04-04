import { FC, ReactNode } from 'react'
import { Typography as Typo } from '@mui/material'
import { styled } from '@mui/material/styles'

export enum VariantType {
  H1 = 'h1', // 48px
  H2 = 'h2', // 40px
  H3 = 'h3', // 24px
  H4 = 'h4', // 22px
  H5 = 'h5', // 20px
  H6 = 'h6', // 18px
  XSMALL = 'xSmall' // 16px
}

interface ITypographyBase {
  color?: string
  fontWeight?: string
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
