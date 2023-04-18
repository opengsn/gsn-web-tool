import React, { FC, ReactNode } from 'react'
import { Button as MuiButton, IconButton as MuiIconButton, Radio as MuiRadio } from '@mui/material'
import { colors } from '../../theme'
import { styled } from '@mui/material/styles'

export enum ButtonType {
  SUBMIT = 'submit',
  BUTTON = 'button'
}

interface IProps {
  backgroundColor?: string
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  color?: string
  type?: ButtonType
}

const ButtonBase: any = styled(MuiButton, {
  shouldForwardProp: (prop: string) => prop !== 'backgroundColor' && prop !== 'color'
})<IProps>(({ backgroundColor, color }) => ({
  backgroundColor: backgroundColor ?? colors.azure,
  color: color ?? colors.black,
  textTransform: 'none',
  height: '100%',
  '&:hover': {
    backgroundColor: backgroundColor ?? colors.azure
  }
}))

const Contained: FC<IProps> = ({ backgroundColor, children, onClick, disabled, color, type }) => {
  return (
    <ButtonBase
      variant='contained'
      onClick={onClick}
      disabled={disabled}
      backgroundColor={backgroundColor}
      color={color}
      type={type}
      fullWidth
    >
      {children}
    </ButtonBase>
  )
}

const Icon: FC<IProps> = ({ children, onClick, disabled }) => {
  return (
    <MuiIconButton onClick={onClick} disabled={disabled} disableRipple>
      {children}
    </MuiIconButton>
  )
}

const Text: FC<IProps> = ({ children, onClick, disabled }) => {
  return (
    <MuiButton variant='text' onClick={onClick} disabled={disabled} sx={{ textTransform: 'none' }}>
      {children}
    </MuiButton>
  )
}

interface IRadioProps {
  onChange: () => void
  value: string
  checked: boolean
}

const Radio: FC<IRadioProps> = ({ onChange, checked, value }) => {
  return <MuiRadio onChange={onChange} checked={checked} value={value} />
}

const Button = {
  Contained,
  Icon,
  Text,
  Radio
}

export default Button
