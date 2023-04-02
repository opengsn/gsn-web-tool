import React, { FC, ReactNode } from 'react'
import { ListItem as MuiListItem, List as MuiList, styled } from '@mui/material'
import { colors } from '../../theme'

interface IProps {
  children?: ReactNode
}

const ListBase = styled(MuiList)(({ theme }) => ({
  border: `1px solid ${colors.cardBackground}`,
  borderRadius: theme.borderRadius.small,
  padding: 0
}))

const List: FC<IProps> = ({ children }) => {
  return <ListBase>{children}</ListBase>
}

const ListItemBase = styled(MuiListItem)(({ theme }) => ({
  borderBottom: `1px solid ${colors.cardBackground}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}))

export const ListItem: FC<IProps> = ({ children }) => {
  return <ListItemBase>{children}</ListItemBase>
}

export default List
