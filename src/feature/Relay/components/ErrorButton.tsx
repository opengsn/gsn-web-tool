import React from 'react'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

interface ErrorButtonProps {
  children: React.ReactNode
  message: string | undefined
  onClick?: () => void
}

const ErrorButton = ({ children, onClick, message }: ErrorButtonProps) => {
  return (
    <div>
      <Alert variant="warning">
        <span>Operation errored with {message}.</span>
        <br />
        <span>Retry?</span>
      </Alert>
      <Button onClick={onClick} variant="outline-primary" className="border border-3 border-danger">{children}</Button>
    </div>
  )
}

export default ErrorButton
