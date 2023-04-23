import React, { FC } from 'react'
import { Alert, Box, Button, TextField, Typography, VariantType } from '../../../../components/atoms'
import { TextFieldType } from '../../../../components/atoms/TextField'

interface IProps {
  onChange: (value: string) => void
  onClick: () => void
  value?: string
  type: TextFieldType
  isLoading: boolean
  isSuccess: boolean
  error?: string
  title: string
  label?: string
  buttonText: string
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
        <Typography variant={VariantType.H6}>{title}</Typography>
      </Box>
      {label != null && (
        <Box>
          <Typography variant={VariantType.XSMALL}>{label}</Typography>
        </Box>
      )}
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
      <Box width='150px'>
        <Button.Contained disabled={isLoading || isSuccess} onClick={onClick}>
          <Typography variant={VariantType.H5}>{isLoading || isSuccess ? <>loading...</> : <>{buttonText}</>}</Typography>
        </Button.Contained>
      </Box>
      {!(error == null) && <Alert severity='error'>Error: {error}</Alert>}
    </Box>
  )
}

export default RegistrationInputWithTitle
