import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useContractRead } from 'wagmi'

import type { RootState, AppDispatch } from './store'

import relayHubAbi from './contracts/relayHub.json'

export const useStakeManagerAddress = (relayHubAddress: string, chainId: number) => useContractRead({
  address: relayHubAddress as any,
  abi: relayHubAbi,
  functionName: 'getStakeManager',
  chainId,
  onError (err) {
    console.warn(err, chainId)
  }
})

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
