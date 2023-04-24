import React, { FC, ReactNode } from 'react'
import { Button as MuiButton, IconButton as MuiIconButton, Radio as MuiRadio } from '@mui/material'

export enum ButtonType {
  SUBMIT = 'submit',
  BUTTON = 'button'
}

type Color = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
type Size = 'small' | 'medium' | 'large'

interface IProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  color?: Color
  type?: ButtonType
  size?: Size
}

const Contained: FC<IProps> = ({ children, onClick, disabled, color, type, size }) => {
  return (
    <MuiButton variant='contained' onClick={onClick} disabled={disabled} color={color} type={type} size={size} fullWidth>
      {children}
    </MuiButton>
  )
}

const Icon: FC<IProps> = ({ children, onClick, disabled }) => {
  return (
    <MuiIconButton
      onClick={onClick}
      disabled={disabled}
      disableRipple
      sx={{
        '&.MuiButtonBase-root': {
          padding: '0px 8px'
        }
      }}
    >
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
  checked: boolean
}

const Radio: FC<IRadioProps> = ({ onChange, checked }) => {
  return <MuiRadio onChange={onChange} checked={checked} />
}

const Button = {
  Contained,
  Icon,
  Text,
  Radio
}

export default Button
