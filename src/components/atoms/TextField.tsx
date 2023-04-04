import React, { ChangeEvent, FC } from 'react'
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
}

const TextField: FC<IProps> = ({ value, onChange, placeholder, type = TextFieldType.Text, helperText, error, name }) => {
  return (
    <MuiTextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      helperText={helperText}
      error={error}
      name={name}
      fullWidth
    />
  )
}

export default TextField
