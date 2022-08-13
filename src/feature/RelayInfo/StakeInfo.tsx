import { useAccount, useContractRead } from 'wagmi'

import { isSameAddress } from '../../utils/utils'

import StakeManagerAbi from '../../contracts/stakeManager.json'
import StakingTokenInfo from './StakingTokenInfo'

interface stakeInfoProps {
  stakeManagerAddress: string
  relayManagerAddress: string
}

export default function StakeInfo ({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const { address } = useAccount()
  const { data: stakeInfo, isLoading } = useContractRead({
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
        return <b>currently connected</b>
      } else {
        return <b>not the connected account</b>
      }
    }

    return (
      <>
        <tr>
          <td>Current Owner</td>
          <td>{owner}</td>
          <td><ShowOwner /></td>
        </tr>
        <StakingTokenInfo stakingToken={token} />
      </>
    )
  }

  if (isLoading) return <div>Loading stake data</div>
  return <div>Failed to fetch stake data</div>
}
