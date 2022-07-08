import { useAccount, useContractRead } from 'wagmi'

import { isSameAddress } from '@opengsn/common/dist/Utils'
import { Address } from '@opengsn/common/dist/types/Aliases'
import StakeManagerAbi from '../../contracts/stakeManager.json'

import StakingTokenInfo from './StakingTokenInfo'

interface stakeInfoProps {
  stakeManagerAddress: Address
  relayManagerAddress: Address
}

export default function StakeInfo ({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const { address } = useAccount()
  const { data: stakeInfo } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi,
    functionName: 'getStakeInfo',
    args: relayManagerAddress,
    watch: false
  })

  if (stakeInfo !== undefined) {
    const { owner, token } = stakeInfo[0]
    const ShowOwner = () => {
      if (address !== undefined && isSameAddress(address, owner)) {
        return <span>(our account)</span>
      } else {
        return <span>(not our account)</span>
      }
    }

    return (
      <>
        <div>current owner: {owner} <ShowOwner /></div>
        <StakingTokenInfo stakingToken={token} />
      </>
    )
  }

  return <div>Failed to fetch stake data</div>
}
