import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useContractRead } from 'wagmi'

import type { RootState, AppDispatch } from './store'

import RelayHub from './contracts/RelayHub.json'

import { Theme, useMediaQuery } from '@mui/material'

export const useStakeManagerAddress = (relayHubAddress: string, chainId: number) =>
  useContractRead({
    address: relayHubAddress as any,
    abi: RelayHub.abi,
    functionName: 'getStakeManager',
    chainId,
    onError(err) {
      console.warn(err, chainId)
    }
  })

export const useIsDesktop = () => {
  return useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
