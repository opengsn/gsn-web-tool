import { useAccount, useContractRead } from 'wagmi'

import { isSameAddress } from '../../utils/utils'

import StakeManagerAbi from '../../contracts/stakeManager.json'
import StakingTokenInfo from './StakingTokenInfo'
import { useAppSelector } from '../../hooks'

interface stakeInfoProps {
  stakeManagerAddress: string
  relayManagerAddress: string
}

export default function StakeInfo ({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const relayData = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)

  const { address } = useAccount()
  const { data: stakeInfo, isSuccess } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi,
    functionName: 'getStakeInfo',
    args: relayManagerAddress,
    chainId
  })

  if (stakeInfo !== undefined && isSuccess) {
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
        <StakingTokenInfo stakingToken={token} chainId={chainId} />
      </>
    )
  }

  const LoadingRow = <tr><td colSpan={3}>Loading data</td></tr>
  return <>{LoadingRow}{LoadingRow}</>
}
