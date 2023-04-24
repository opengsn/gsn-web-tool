import { useState } from 'react'
import { Box, Button, Icon, Typography } from '../../../components/atoms'

interface IProps {
  address: string
  url?: string
}

export default function BlockExplorerUrl({ address, url }: IProps) {
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
      <a href={`${url}/address/${address}`} target='_blank' rel='noreferrer'>
        <span>{truncated}</span>
      </a>
    )
  } else {
    addressElem = <span>{truncated}</span>
  }

  return (
    <Typography variant='body2'>
      {addressElem}
      <Box component='span'>{copyButton}</Box>
    </Typography>
  )
}
