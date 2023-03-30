import React, { FC, ReactNode } from 'react'
import { Container as MuiContainer } from '@mui/material'

interface IProps {
  children: ReactNode
}

const Container: FC<IProps> = ({ children }) => {
  return <MuiContainer>{children}</MuiContainer>
}

export default Container
