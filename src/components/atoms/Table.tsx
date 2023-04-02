import React, { FC, ReactNode } from 'react'
import { Table as MuiTable, TableRow as MuiRowTable, styled } from '@mui/material'
import { colors } from '../../theme'

interface IProps {
  children: ReactNode
}

const Table: FC<IProps> = ({ children }) => {
  return <MuiTable>{children}</MuiTable>
}

const TableRowBase = styled(MuiRowTable)(({ theme }) => ({
  borderBottom: `1px solid ${colors.cardBackground}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}))

export const TableRow: FC<IProps> = ({ children }) => {
  return <TableRowBase>{children}</TableRowBase>
}

export default Table
