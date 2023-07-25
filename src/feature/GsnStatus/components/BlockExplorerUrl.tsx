import { useState } from 'react'
import { Box, Button, Icon, Link, Typography } from '../../../components/atoms'
import { useTheme } from '@mui/material'

interface IProps {
  address: string
  url?: string
}

export default function BlockExplorerUrl({ address, url }: IProps) {
  const theme = useTheme()
  const [copied, setCopied] = useState(false)
  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 8000)
    } catch (err) {
      setCopied(false)
    }
  }

  const copyButton = (
    <Button.Icon
      onClick={() => {
        copyToClipBoard(address).catch(console.error)
      }}
    >
      {copied ? <Icon.ClipboardCheck /> : <Icon.Clipboard />}
    </Button.Icon>
  )

  const firstFourCharsInAddr = address.slice(2, 6)
  const lastFourCharsInAddr = address.slice(-4)
  const truncated = `${firstFourCharsInAddr}...${lastFourCharsInAddr}`

  let addressElem
  if (url !== undefined) {
    addressElem = (
      <Link href={`${url}/address/${address}`} textDecorationColor={theme.palette.primary.mainCTA}>
        <Typography variant='h5' color={theme.palette.primary.mainCTA}>
          {truncated}
        </Typography>
      </Link>
    )
  } else {
    addressElem = (
      <Typography variant='h5' color={theme.palette.primary.mainCTA}>
        {truncated}
      </Typography>
    )
  }

  return (
    <>
      {addressElem}
      <Box component='span'>{copyButton}</Box>
    </>
  )
}
