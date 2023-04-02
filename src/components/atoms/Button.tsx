import React, { FC, ReactNode } from 'react'
import { Button as MuiButton } from '@mui/material'
import { colors } from '../../theme'
import { styled } from '@mui/material/styles'

interface IProps {
  backgroundColor?: string
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  color?: string
}

const ButtonBase = styled(MuiButton, {
  shouldForwardProp: (prop: string) => prop !== 'backgroundColor' && prop !== 'color'
})<IProps>(({ backgroundColor, color }) => ({
  backgroundColor: backgroundColor ?? colors.green,
  color: color ?? colors.white,
  textTransform: 'none',
  height: '100%',
  '&:hover': {
    backgroundColor: backgroundColor ?? colors.green
  }
}))

const Contained: FC<IProps> = ({ backgroundColor, children, onClick, disabled }) => {
  return (
    <ButtonBase variant='contained' onClick={onClick} disabled={disabled} backgroundColor={backgroundColor} fullWidth>
      {children}
    </ButtonBase>
  )
}

const Button = {
  Contained
}

export default Button
