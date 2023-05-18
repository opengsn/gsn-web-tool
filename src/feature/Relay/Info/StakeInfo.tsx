import { useContractRead } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { validateConfigOwnerInLineWithStakeManager } from '../relaySlice'
import StakeManager from '../../../contracts/StakeManager.json'
import StakingToken from './StakeManagerInfo/StakingToken'
import { useEffect } from 'react'

interface stakeInfoProps {
  stakeManagerAddress: string
  relayManagerAddress: string
}

export default function StakeInfo({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const relayData = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)

  const dispatch = useAppDispatch()
  const { data: stakeInfo, refetch } = useContractRead({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    functionName: 'getStakeInfo',
    args: [relayManagerAddress],
    enabled: relayManagerAddress !== '',
    chainId,
    onSuccess(data) {
      if (relayData.ready) return
      dispatch(validateConfigOwnerInLineWithStakeManager((data as any)[0].owner))
    }
  })

  useEffect(() => {
    if (relayData.ready) {
      refetch()
    }
  }, [refetch, relayData.ready])

  const token = (stakeInfo as any)?.[0]?.token
  return <StakingToken stakingToken={token} chainId={chainId} />
}
