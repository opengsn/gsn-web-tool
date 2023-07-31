import React, { FC, ReactNode } from 'react'
import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent, styled, useTheme } from '@mui/material'

interface IProps {
  children: ReactNode
  success?: boolean
}

const Card: FC<IProps> = ({ children, success }) => {
  const theme = useTheme()
  return (
    <MuiCard
      variant='outlined'
      sx={{
        bgcolor: 'primary.cardBG',
        borderRadius: theme.borderRadius.medium,
        borderColor: success ? theme.palette.primary.mainPos : theme.palette.primary.cardOutline
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
