/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { FC } from 'react'
import { Alert, Box, Button, Divider, Icon, TextField, Typography } from '../atoms'
import { TextFieldType } from '../atoms/TextField'
import { formatMetaMaskError } from '../../utils'
import metamaskNonceResetImage from '../../assets/images/metamask_nonce_reset.jpg'
import { useTheme } from '@mui/material'

export const waitingForApproveText = 'Use your wallet'

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
  disabled?: boolean
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
  warningAlert,
  disabled
}) => {
  const theme = useTheme()
  const renderButtonText = () => {
    if (isLoadingForTransaction || isSuccess) {
      return 'Processing...'
    } else if (isLoading) {
      return 'Waiting for approval'
    } else {
      return buttonText
    }
  }

  const isNonceError = error?.includes('Nonce too high')

  return (
    <Box>
      <Box>
        <Typography variant={'h5'} fontWeight={700}>
          {title}
        </Typography>
      </Box>
      <Box mt={10} mb={7}>
        <Divider />
      </Box>
      {label != null && (
        <Box mb={2}>
          <Typography variant='h4' color={theme.palette.primary.mainCTA}>
            {label}
          </Typography>
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
        <Box width='400px' mb={10}>
          <TextField
            type={type}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            value={value}
            placeholder={placeholder}
            min={0}
            step={0.5}
          />
        </Box>
      )}
      <Box width='220px' mb={10}>
        <Button.CTA disabled={isLoading || isLoadingForTransaction || isSuccess || disabled} onClick={onClick} text={renderButtonText()} />
        {isLoading && (
          <Alert severity='info' icon={<Icon.Info />}>
            {waitingForApproveText}
          </Alert>
        )}
      </Box>
      {error && (
        <Alert severity='error'>
          <Typography variant='h6' fontWeight={600}>
            {formatMetaMaskError(error)}
          </Typography>
          <br />
          {isNonceError && <Box mt={3} component='img' src={metamaskNonceResetImage} alt='Nonce Error' width='800px' />}
        </Alert>
      )}
    </Box>
  )
}

export default RegistrationInputWithTitle
