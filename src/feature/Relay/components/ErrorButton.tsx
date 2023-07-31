import React from 'react'
import { Alert, Button, Typography } from '../../../components/atoms'

interface ErrorButtonProps {
  children: React.ReactNode
  message: string | undefined
  onClick?: () => void
}

const ErrorButton = ({ children, onClick, message }: ErrorButtonProps) => {
  return (
    <div>
      <Alert severity='error'>
        <Typography variant='h6' fontWeight={600}>
          <span>Operation errored with {message}.</span>
          <br />
          <span>Retry?</span>
        </Typography>
      </Alert>
      <Button.Contained onClick={onClick}>{children}</Button.Contained>
    </div>
  )
}

export default ErrorButton
