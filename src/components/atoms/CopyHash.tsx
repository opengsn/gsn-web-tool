import React, { FC } from 'react'
import { Box, Button, Typography } from '../atoms'
import { copyTextToClipboard } from '../../utils'

interface IProps {
  copyValue?: string
}

const CopyHash: FC<IProps> = ({ copyValue }) => {
  return (
    <Box ml='auto'>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button.Text onClick={async () => await copyTextToClipboard(copyValue ?? '')}>
        <Typography variant={'body2'} color={'success'} fontWeight={600}>
          Copy hash
        </Typography>
      </Button.Text>
    </Box>
  )
}

export default CopyHash
