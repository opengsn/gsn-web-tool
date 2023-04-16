import React, { FC, ReactNode } from 'react'
import { Collapse as MuiCollapse } from '@mui/material'

interface Props {
  in: boolean
  children: ReactNode
}

const Collapse: FC<Props> = ({ in: inProp, children }) => {
  return <MuiCollapse in={inProp}>{children}</MuiCollapse>
}

export default Collapse
