import React, { FC, ReactNode } from 'react'
import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent, styled } from '@mui/material'

interface IProps {
  children: ReactNode
}

const Card: FC<IProps> = ({ children }) => {
  return (
    <MuiCard
      variant='outlined'
      sx={{
        bgcolor: 'primary.cardBG'
      }}
    >
      {children}
    </MuiCard>
  )
}

interface ICardHeaderProps {
  title: ReactNode
}

export const CardHeaderBase = styled(MuiCardHeader)<ICardHeaderProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.cardBG
}))

export const CardHeader: FC<ICardHeaderProps> = ({ title }) => {
  return <CardHeaderBase title={title} />
}

export const CardContent: FC<IProps> = ({ children }) => {
  return (
    <MuiCardContent
      sx={{
        bgcolor: 'primary.cardBG'
      }}
    >
      {children}
    </MuiCardContent>
  )
}

export default Card
