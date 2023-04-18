import React, { FC } from 'react'
import { Box, TextField, Typography } from '../../../../../../components/atoms'

interface IProps {
  handleChangeToken: (token: string) => void
}

const InsertERC20TokenAddress: FC<IProps> = ({ handleChangeToken }) => {
  return <TextField onChange={(e) => handleChangeToken(e.target.value)} placeholder='Token address: 0x...' />
}

export default InsertERC20TokenAddress
