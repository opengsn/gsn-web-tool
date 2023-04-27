import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useContractRead } from 'wagmi'

import type { RootState, AppDispatch } from './store'

import RelayHub from './contracts/RelayHub.json'

import { Theme, useMediaQuery } from '@mui/material'
import { useState } from 'react'

export const useStakeManagerAddress = (relayHubAddress: string, chainId: number, onSuccess?: () => void) =>
  useContractRead({
    address: relayHubAddress as any,
    abi: RelayHub.abi,
    functionName: 'getStakeManager',
    chainId,
    enabled: false,
    onSuccess,
    onError(err) {
      console.warn(err, chainId)
    }
  })

export const useIsDesktop = () => {
  return useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
}

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

export const useCopyToClipboard = (): [CopiedValue, CopyFn] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = async (text) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
