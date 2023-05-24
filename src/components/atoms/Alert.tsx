import React, { FC, ReactNode } from 'react'
import { Alert as MuiAlert } from '@mui/material'

interface IProps {
  severity: 'error' | 'warning' | 'info' | 'success'
  children: ReactNode
  icon?: boolean
}

const Alert: FC<IProps> = ({ severity, children, icon }) => {
  return <MuiAlert severity={severity} icon={icon}>{children}</MuiAlert>
}

export default Alert
