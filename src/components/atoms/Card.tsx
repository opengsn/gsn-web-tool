import React, { FC, ReactNode } from 'react'
import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent, styled } from '@mui/material'
import { colors } from '../../theme'
import { Border } from 'react-bootstrap-icons'

interface IProps {
  children: ReactNode
}

const Card: FC<IProps> = ({ children }) => {
  return <MuiCard>{children}</MuiCard>
}

interface ICardHeaderProps {
  title: ReactNode
}

export const CardHeaderBase = styled(MuiCardHeader)<ICardHeaderProps>(({ theme }) => ({
  backgroundColor: colors.cardBackground
}))

export const CardHeader: FC<ICardHeaderProps> = ({ title }) => {
  return <CardHeaderBase title={title} />
}

export const CardContent: FC<IProps> = ({ children }) => {
  return <MuiCardContent>{children}</MuiCardContent>
}

export default Card
