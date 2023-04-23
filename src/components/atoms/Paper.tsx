import React, { FC, ReactNode } from 'react'
import { Paper as MuiPaper } from '@mui/material'

interface IProps {
  elevation?: number
  children: ReactNode
}

const Paper: FC<IProps> = ({ children, elevation = 1 }) => {
  return <MuiPaper elevation={elevation}>{children}</MuiPaper>
}

export default Paper
