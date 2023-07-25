import React, { FC, ReactNode } from 'react'
import { styled, Chip as MuiChip } from '@mui/material'

interface IProps {
  icon?: JSX.Element
  label?: ReactNode
  onClick?: () => void
  active?: boolean
}

const ChipBase: any = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'active'
})<IProps>(({ theme, active }) => ({
  backgroundColor: theme.palette.primary.cardBG,
  border: `1px solid ${active ? theme.palette.primary.mainCTA : theme.palette.primary.cardOutline}`,
  borderRadius: theme.borderRadius.small
}))

const Chip: FC<IProps> = ({ label, icon, onClick, active }) => {
  return <ChipBase label={label} icon={icon} onClick={onClick} active={active} />
}

export default Chip
