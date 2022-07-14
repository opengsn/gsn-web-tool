import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useContractRead } from 'wagmi'

import type { RootState, AppDispatch } from './store'

import relayHubAbi from './contracts/relayHub.json'
import StakeManagerAbi from './contracts/stakeManager.json'

import { Address } from '@opengsn/common/dist/types/Aliases'

export const useStakeManagerAddress = (relayHubAddress: Address) => useContractRead({
  addressOrName: relayHubAddress,
  contractInterface: relayHubAbi,
  functionName: 'getStakeManager',
  onError (err) { console.warn(err) }
})

export const useStakeInfo = (stakeManagerAddress: Address, relayManagerAddress: Address) => useContractRead({
  addressOrName: stakeManagerAddress,
  contractInterface: StakeManagerAbi,
  functionName: 'getStakeInfo',
  args: relayManagerAddress,
  watch: true
})

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
