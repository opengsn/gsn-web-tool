import React, { FC, MouseEvent, ReactNode } from 'react'
import { Button as MuiButton, IconButton as MuiIconButton, Radio as MuiRadio, styled, useTheme } from '@mui/material'
import Typography from './Typography'

export enum ButtonType {
  SUBMIT = 'submit',
  BUTTON = 'button'
}

type Size = 'small' | 'medium' | 'large'

interface IProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  bgColor?: string
  borderColor?: string
  type?: ButtonType
  size?: Size
  height?: string
}

const ButtonBase: any = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'height' && prop !== 'borderColor'
})<IProps>(({ theme, bgColor, height, borderColor }) => ({
  '&.MuiButton-root': {
    backgroundColor: bgColor ?? theme.palette.primary.mainCTA,
    height: height ?? '56px',
    textTransform: 'none',
    border: borderColor && `1px solid ${borderColor}`,
    '&.Mui-disabled': {
      backgroundColor: theme.palette.primary.mainCTADisabled
    }
  }
}))

const Contained: FC<IProps> = ({ children, onClick, disabled, bgColor, type, size, borderColor }) => {
  return (
    <ButtonBase
      variant='contained'
      onClick={onClick}
      disabled={disabled}
      bgColor={bgColor}
      type={type}
      size={size}
      borderColor={borderColor}
      fullWidth
    >
      {children}
    </ButtonBase>
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
  const theme = useTheme()
  return (
    <MuiRadio
      onChange={onChange}
      checked={checked}
      sx={{
        padding: '0 !important',
        '& .MuiSvgIcon-root:not(.MuiSvgIcon-root ~ .MuiSvgIcon-root)': {
          color: theme.palette.primary.cardOutline
        },
        '& .MuiSvgIcon-root + .MuiSvgIcon-root': {
          color: theme.palette.primary.mainCTA
        }
      }}
    />
  )
}

interface ButtonCTAProps {
  onClick?: () => void
  text: string
  disabled?: boolean
  type?: ButtonType
}

export const CTA: FC<ButtonCTAProps> = ({ onClick, disabled, text, type }) => {
  const theme = useTheme()
  return (
    <Contained onClick={onClick} disabled={disabled} type={type}>
      <Typography variant='h3' color={theme.palette.primary.main} fontWeight={500}>
        {text}
      </Typography>
    </Contained>
  )
}

const Button = {
  Contained,
  Icon,
  Text,
  Radio,
  CTA
}

export default Button
