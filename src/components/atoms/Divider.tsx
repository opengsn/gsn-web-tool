import React, { FC } from 'react'
import { Divider as MuiDivider } from '@mui/material'

const Divider: FC = () => {
  return <MuiDivider sx={{ borderColor: (theme) => theme.palette.primary.cardOutline }} />
}

export default Divider
