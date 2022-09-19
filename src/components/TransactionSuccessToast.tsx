import { useState } from 'react'
import { useNetwork } from 'wagmi'

interface TransactionSuccessToastProps {
  text: string
  hash: string
}

export default function TransactionSuccessToast ({ text, hash }: TransactionSuccessToastProps) {
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy hash')

  const { chain } = useNetwork()

  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyButtonText('Copied!')
    } catch (err) {
      setCopyButtonText('Failed to copy!')
    }
  }

  let txData
  if (chain?.blockExplorers !== undefined) {
    txData = <a href={`${chain.blockExplorers.default.url}/${hash}`}>Block Explorer</a>
  } else {
    txData = <b onClick={() => { copyToClipBoard(hash).catch(console.error) }}>{copyButtonText}</b>
  }

  return (<div>
    <span>{text}</span>
    <br />
    {txData}
  </div>)
}
