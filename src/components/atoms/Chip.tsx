import React, { FC, ReactNode } from 'react'
import { styled, Chip as MuiChip } from '@mui/material'

interface IProps {
  icon?: JSX.Element
  label?: ReactNode
  onClick?: () => void
  active?: boolean
}

const GroupChipBase: any = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'active'
})<IProps>(({ theme, active }) => ({
  backgroundColor: theme.palette.primary.cardBG,
  border: `1px solid ${active ? theme.palette.primary.mainCTA : theme.palette.primary.cardOutline}`,
  borderRadius: theme.borderRadius.small
}))

export const GroupChip: FC<IProps> = ({ label, icon, onClick, active }) => {
  return <GroupChipBase label={label} icon={icon} onClick={onClick} active={active} />
}

interface IChipProps extends IProps {
  bgcolor?: string
  size?: 'small' | 'medium'
}

const ChipBase: any = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'bgcolor'
})<IChipProps>(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor ?? theme.palette.primary.white,
  borderRadius: theme.borderRadius.small
}))

export const Chip: FC<IChipProps> = ({ label, icon, bgcolor, size = 'small' }) => {
  return <ChipBase label={label} icon={icon} bgcolor={bgcolor} size={size} />
}
