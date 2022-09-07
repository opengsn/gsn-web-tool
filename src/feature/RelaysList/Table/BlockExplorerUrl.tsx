import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons'

export default function BlockExplorerUrl ({ address, url }: { address: string, url?: string }) {
  const [copied, setCopied] = useState(false)
  const copyIconSize = 12
  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 8000)
    } catch (err) {
      setCopied(false)
    }
  }
  const copyButton =
    <Button
      onClick={() => { copyToClipBoard(address).catch(console.error) }}
      variant="outline"
      style={{ verticalAlign: 'unset' }}
      size="sm"
    >
      {copied ? <ClipboardCheck size={copyIconSize} /> : <Clipboard size={copyIconSize} />}
    </Button>

  const firstFourCharsInAddr = address.slice(2, 6)
  const lastFourCharsInAddr = address.slice(-4)
  const truncated = `${firstFourCharsInAddr}...${lastFourCharsInAddr}`

  let addressElem
  if (url !== undefined) {
    addressElem = <a href={`${url}/address/${address}`}
      target="_blank" rel="noreferrer">
      <span>{truncated}</span>
    </a>
  } else {
    addressElem = <span>{truncated}</span>
  }

  return <>{addressElem}{copyButton}</>
}
