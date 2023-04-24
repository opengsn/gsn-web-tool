import React, { FC } from 'react'
import { Box, Button, Typography, VariantType } from '../atoms'
import { copyToClipboard } from '../../utils'

interface IProps {
  copyValue?: string
}

const CopyHash: FC<IProps> = ({ copyValue }) => {
  return (
    <Box ml='auto'>
      <Button.Text onClick={() => copyToClipboard(copyValue ?? '')}>
        <Typography variant={VariantType.H5} color={'success'} fontWeight={600}>
          Copy hash
        </Typography>
      </Button.Text>
    </Box>
  )
}

export default CopyHash
