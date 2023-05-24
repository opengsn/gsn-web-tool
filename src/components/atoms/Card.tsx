import React, { FC, ReactNode } from 'react'
import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent, styled } from '@mui/material'

interface IProps {
  children: ReactNode
}

const Card: FC<IProps> = ({ children }) => {
  return <MuiCard variant='outlined'>{children}</MuiCard>
}

interface ICardHeaderProps {
  title: ReactNode
}

export const CardHeaderBase = styled(MuiCardHeader)<ICardHeaderProps>(({ theme }) => ({
  backgroundColor: theme.palette.grey[100]
}))

export const CardHeader: FC<ICardHeaderProps> = ({ title }) => {
  return <CardHeaderBase title={title} />
}

export const CardContent: FC<IProps> = ({ children }) => {
  return <MuiCardContent>{children}</MuiCardContent>
}

export default Card
