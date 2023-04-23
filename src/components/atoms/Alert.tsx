import React, { FC, ReactNode } from 'react'
import { Alert as MuiAlert } from '@mui/material'

interface IProps {
  severity: 'error' | 'warning' | 'info' | 'success'
  children: ReactNode
}

const Alert: FC<IProps> = ({ severity, children }) => {
  return <MuiAlert severity={severity}>{children}</MuiAlert>
}

export default Alert
