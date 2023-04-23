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
}

const TextField: FC<IProps> = ({ value, onChange, placeholder, type = TextFieldType.Text, helperText, error, name, ref }) => {
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
      fullWidth
    />
  )
}

export default TextField
