/* eslint-disable react/prop-types */ // fix this
import { FC, ReactNode } from 'react'
import { Typography as Typo } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ITypographyBase {
  color?: string
  fontWeight?: string
  children: ReactNode
  variant?: string
}

interface IText {
  [property: string]: FC<ITypographyBase>
}

const TypographyBase: any = styled(Typo, {
  shouldForwardProp: (prop: string) => prop !== 'color' && prop !== 'fontWeight'
})<ITypographyBase>(({ theme, color, fontWeight }) => ({
  color: color ?? 'inherit',
  fontWeight: fontWeight ?? 'inherit',
  whiteSpace: 'pre-line'
}))

const Typography: IText = {
  Body1: ({ children, color, fontWeight }) => (
    <TypographyBase variant='h1' component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  ),
  Body2: ({ children, color, fontWeight }) => (
    <TypographyBase variant='h2' component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  ),
  Body3: ({ children, color, fontWeight }) => (
    <TypographyBase variant='h3' component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  ),
  Body4: ({ children, color, fontWeight }) => (
    <TypographyBase variant='h4' component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  ),
  Body5: ({ children, color, fontWeight }) => (
    <TypographyBase variant='h5' component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  ),
  Body6: ({ children, color, fontWeight }) => (
    <TypographyBase variant='h6' component='span' color={color} fontWeight={fontWeight}>
      {children}
    </TypographyBase>
  )
}

export default Typography
