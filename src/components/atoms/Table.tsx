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
  width?: string
  onClick?: () => void
}

const Table: FC<IProps> = ({ children }) => {
  return <MuiTable>{children}</MuiTable>
}

const TableRowBase = styled(MuiRowTable)<IProps>(({ theme, onClick }) => ({
  cursor: onClick ? 'pointer' : 'default',
  '&:hover': onClick && {
    backgroundColor: theme.palette.primary.tableRowHover
  }
}))

export const TableRow: FC<IProps> = ({ children, onClick }) => {
  return <TableRowBase onClick={onClick}>{children}</TableRowBase>
}

const TableHeadBase = styled(MuiTableHead)(({ theme }) => ({}))

export const TableHead: FC<IProps> = ({ children }) => {
  return <TableHeadBase>{children}</TableHeadBase>
}

const TableCellBase = styled(MuiTableCell, {
  shouldForwardProp: (prop) => prop !== 'width'
})(({ theme, width }) => ({
  padding: '5px',
  borderColor: theme.palette.primary.cardOutline,
  width: width ?? 'auto'
}))

export const TableCell: FC<IProps> = ({ children, width }) => {
  return <TableCellBase width={width}>{children}</TableCellBase>
}

export const TableContainer: FC<IProps> = ({ children }) => {
  return (
    <MuiTableContainer
      component={Paper}
      sx={{
        bgcolor: 'primary.cardBG',
        boxShadow: 'none'
      }}
    >
      {children}
    </MuiTableContainer>
  )
}

export default Table
