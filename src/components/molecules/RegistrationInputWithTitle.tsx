import React, { FC } from 'react'
import { Alert, Box, Button, TextField, Typography } from '../atoms'
import { TextFieldType } from '../atoms/TextField'

interface IProps {
  title: string
  onClick: () => void
  onChange?: (value: string) => void
  buttonText: string
  isLoading: boolean
  isSuccess: boolean
  type?: TextFieldType
  error?: string
  label?: string
  value?: string
  placeholder?: string
}

const RegistrationInputWithTitle: FC<IProps> = ({
  onChange,
  value,
  type,
  isLoading,
  buttonText,
  isSuccess,
  error,
  onClick,
  title,
  label,
  placeholder
}) => {
  return (
    <Box my='10px'>
      <Box mb='5px'>
        <Typography variant={'subtitle2'}>{title}</Typography>
      </Box>
      {label != null && (
        <Box>
          <Typography variant='body2'>{label}</Typography>
        </Box>
      )}
      {onChange != null && (
        <Box width='400px' mb='10px'>
          <TextField
            type={type}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            value={value}
            placeholder={placeholder}
          />
        </Box>
      )}
      <Box width='150px' mb='10px'>
        <Button.Contained disabled={isLoading || isSuccess} onClick={onClick}>
          <Typography variant={'body2'}>{isLoading || isSuccess ? <>loading...</> : <>{buttonText}</>}</Typography>
        </Button.Contained>
      </Box>
      {!(error == null) && <Alert severity='error'>Error: {error}</Alert>}
    </Box>
  )
}

export default RegistrationInputWithTitle
