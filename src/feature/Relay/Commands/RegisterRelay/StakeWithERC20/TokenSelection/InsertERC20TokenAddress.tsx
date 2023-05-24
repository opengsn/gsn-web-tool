import React, { FC } from 'react'
import { TextField } from '../../../../../../components/atoms'

interface IProps {
  handleChangeToken: (token: string) => void
  disabled?: boolean
}

const InsertERC20TokenAddress: FC<IProps> = ({ handleChangeToken, disabled }) => {
  return <TextField onChange={(e) => handleChangeToken(e.target.value)} disabled={disabled} placeholder='Token address: 0x...' />
}

export default InsertERC20TokenAddress
