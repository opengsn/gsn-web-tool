import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useContractRead } from 'wagmi'

import type { RootState, AppDispatch } from './store'

import relayHubAbi from './contracts/relayHub.json'

import { Address } from '@opengsn/common/dist/types/Aliases'

export const useStakeManagerAddress = (relayHubAddress: Address, chainId: number) => useContractRead({
  addressOrName: relayHubAddress,
  contractInterface: relayHubAbi,
  functionName: 'getStakeManager',
  chainId: chainId,
  onError (err) {
    console.warn(err, chainId)
    console.warn(chainId)
    console.warn(chainId)
    console.warn(chainId)
  }
})

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
