import React, { FC, ReactNode } from 'react'
import { Alert as MuiAlert, styled } from '@mui/material'

interface IProps {
  severity: 'error' | 'warning' | 'info' | 'success'
  children: ReactNode
  icon?: ReactNode
}

const AlertBase = styled(
  MuiAlert,
  {}
)(({ theme }) => ({
  '&.MuiAlert-standardError': {
    backgroundColor: theme.palette.primary.chipBGError,
    '& .MuiAlert-icon': {
      fontSize: '32px',
      color: theme.palette.primary.chipTextError
    }
  },
  '&.MuiAlert-standardInfo': {
    backgroundColor: theme.palette.primary.alertInfoBG,
    color: theme.palette.primary.white
  },
  '& .MuiAlert-message': {
    display: 'flex',
    alignItems: 'center'
  }
}))

const Alert: FC<IProps> = ({ severity, children, icon }) => {
  return (
    <AlertBase severity={severity} icon={icon}>
      {children}
    </AlertBase>
  )
}

export default Alert
