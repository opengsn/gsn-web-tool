/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { FC, MouseEvent, useState } from 'react'
import { copyTextToClipboard } from '../../utils'
import Tooltip from '../atoms/Tooltip'
import { Button } from '@mui/material'
import Icon from '../atoms/Icon'

interface IProps {
  copyValue: string
}

const CopyButton: FC<IProps> = ({ copyValue }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    await copyTextToClipboard(copyValue)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Tooltip title={isCopied ? 'Copied!' : 'Copy Address'}>
      <Button
        onClick={handleCopyClick}
        sx={(theme) => ({
          minWidth: '22px',
          height: '22px',
          bgcolor: theme.palette.primary.copyButtonBG,
          borderRadius: theme.borderRadius.full,
          p: 0,
          '&:hover': {
            bgcolor: theme.palette.primary.copyButtonBG
          }
        })}
      >
        <Icon.CopyToClipboard />
      </Button>
    </Tooltip>
  )
}

export default CopyButton
