import React, { ChangeEvent, FC, RefObject } from 'react'
import { TextField as MuiTextField } from '@mui/material'

export enum TextFieldType {
  Text = 'text',
  Password = 'password',
  Email = 'email',
  Number = 'number'
}

interface IProps {
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: TextFieldType
  helperText?: string
  error?: boolean
  name?: string
  ref?: RefObject<HTMLInputElement>
  disabled?: boolean
  min?: number
  step?: number
}

const TextField: FC<IProps> = ({
  value,
  onChange,
  placeholder,
  type = TextFieldType.Text,
  helperText,
  error,
  name,
  ref,
  disabled,
  min,
  step
}) => {
  return (
    <MuiTextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      helperText={helperText}
      size='small'
      error={error}
      name={name}
      ref={ref}
      disabled={disabled}
      inputProps={{
        min,
        step
      }}
      fullWidth
    />
  )
}

export default TextField
