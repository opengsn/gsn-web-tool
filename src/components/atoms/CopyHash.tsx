/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { FC, useState } from 'react'
import { Button } from '@mui/material'
import { copyTextToClipboard } from '../../utils'
import { Box, Tooltip, Typography } from '../atoms'

interface IProps {
  copyValue?: string
}

const CopyHash: FC<IProps> = ({ copyValue }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyClick = async () => {
    await copyTextToClipboard(copyValue ?? '')
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Box ml='auto'>
      <Tooltip placement='top' arrow title={isCopied ? 'Copied!' : 'Copy Address'}>
        <Button onClick={handleCopyClick} sx={{ textTransform: 'none' }}>
          <Typography variant='body2' color='success' fontWeight={600}>
            Copy hash
          </Typography>
        </Button>
      </Tooltip>
    </Box>
  )
}

export default CopyHash
