import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons'

export default function BlockExplorerUrl ({ address, url }: { address: string, url?: string }) {
  const [copied, setCopied] = useState(false)
  const copyIconSize = 16
  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      setCopied(false)
    }
  }
  const copyButton = <Button
    onClick={() => { copyToClipBoard(address).catch(console.error) }}
    variant="outline"
    style={{ verticalAlign: 'unset' }}
    size="sm"
  >
    {copied
      ? <ClipboardCheck size={copyIconSize} />
      : <Clipboard size={copyIconSize} />}
  </Button>

  let addressElem
  if (url !== undefined) {
    addressElem = <a href={`${url}/address/${address}`} target="_blank" rel="noreferrer">{address}</a>
  } else {
    addressElem = <span>{address}</span>
  }

  return <>{addressElem}{copyButton}</>
}
