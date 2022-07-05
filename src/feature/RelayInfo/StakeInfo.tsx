import { useContractRead } from 'wagmi'

import { Address } from '@opengsn/common/dist/types/Aliases'
import StakeManagerAbi from '../../contracts/stakeManager.json'

interface stakeInfoProps {
  stakeManagerAddress: Address
  relayManagerAddress: Address
}

export default function StakeInfo ({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const { data: stakeInfo } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi,
    functionName: 'getStakeInfo',
    args: relayManagerAddress,
    watch: false
  })
  if (stakeInfo !== undefined) {
    const { owner, token } = stakeInfo[0]

    return (
      <div>
        <div>current owner: {owner}</div>
        <div>staking token: {token}</div>
      </div>
    )
  }
  return <div>Failed to fetch stake data</div>
}
