import React, { FC, ReactNode } from 'react'
import {
  Table as MuiTable,
  TableRow as MuiRowTable,
  TableHead as MuiTableHead,
  TableCell as MuiTableCell,
  styled,
  TableContainer as MuiTableContainer,
  Paper
} from '@mui/material'

interface IProps {
  children: ReactNode
}

const Table: FC<IProps> = ({ children }) => {
  return <MuiTable>{children}</MuiTable>
}

const TableRowBase = styled(MuiRowTable)<IProps>(({ theme }) => ({}))

export const TableRow: FC<IProps> = ({ children }) => {
  return <TableRowBase>{children}</TableRowBase>
}

const TableHeadBase = styled(MuiTableHead)(({ theme }) => ({}))

export const TableHead: FC<IProps> = ({ children }) => {
  return <TableHeadBase>{children}</TableHeadBase>
}

const TableCellBase = styled(MuiTableCell)(({ theme }) => ({
  padding: '5px'
}))

export const TableCell: FC<IProps> = ({ children }) => {
  return <TableCellBase>{children}</TableCellBase>
}

export const TableContainer: FC<IProps> = ({ children }) => {
  return (
    <MuiTableContainer
      component={Paper}
      sx={{
        p: 4
      }}
    >
      {children}
    </MuiTableContainer>
  )
}

export default Table
