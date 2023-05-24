import React from 'react'
import { Alert, Button } from '../../../components/atoms'

interface ErrorButtonProps {
  children: React.ReactNode
  message: string | undefined
  onClick?: () => void
}

const ErrorButton = ({ children, onClick, message }: ErrorButtonProps) => {
  return (
    <div>
      <Alert severity='error'>
        <span>Operation errored with {message}.</span>
        <br />
        <span>Retry?</span>
      </Alert>
      <Button.Contained onClick={onClick}>{children}</Button.Contained>
    </div>
  )
}

export default ErrorButton
