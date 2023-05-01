/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { FC } from 'react'
import { Alert, Box, Button, TextField, Typography } from '../atoms'
import { TextFieldType } from '../atoms/TextField'
import { formatMetaMaskError } from '../../utils'

export const waitingForApproveText = 'Please approve the action in your wallet and wait for action processing by the blockchain'

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
  isLoadingForTransaction?: boolean
  warningAlert?: string
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
  placeholder,
  isLoadingForTransaction,
  warningAlert
}) => {
  const renderButtonText = () => {
    if ((isLoadingForTransaction ?? false) || isSuccess) {
      return 'Processing...'
    } else if (isLoading) {
      return 'Waiting for approval'
    } else {
      return buttonText
    }
  }

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
      {warningAlert != null && (
        <Box mb={'10px'} width='400px'>
          <Alert severity='warning'>
            <Typography variant='body2'>{warningAlert}</Typography>
          </Alert>
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
      <Box width='220px' mb='10px'>
        <Button.Contained disabled={isLoading || isLoadingForTransaction || isSuccess} onClick={onClick} size='large'>
          <Typography variant={'body2'}>{renderButtonText()}</Typography>
        </Button.Contained>
        {isLoading && (
          <Alert severity='info' icon={false}>
            {waitingForApproveText}
          </Alert>
        )}
      </Box>
      {!(error == null) && (
        <Alert severity='error'>
          <Typography variant='body2'>{formatMetaMaskError(error)}</Typography>
        </Alert>
      )}
    </Box>
  )
}

export default RegistrationInputWithTitle
