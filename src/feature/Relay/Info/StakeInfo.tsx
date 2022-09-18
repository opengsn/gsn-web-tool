import { useAccount, useContractRead } from 'wagmi'

import { useAppDispatch, useAppSelector } from '../../../hooks'
import { isSameAddress } from '../../../utils'

import { validateConfigOwnerInLineWithStakeManager } from '../relaySlice'

import StakeManagerAbi from '../../../contracts/stakeManager.json'
import StakingToken from './StakeManagerInfo/StakingToken'

interface stakeInfoProps {
  stakeManagerAddress: string
  relayManagerAddress: string
}

export default function StakeInfo ({ stakeManagerAddress, relayManagerAddress }: stakeInfoProps) {
  const relayData = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)

  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const { data: stakeInfo, isSuccess } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi,
    functionName: 'getStakeInfo',
    args: relayManagerAddress,
    chainId,
    watch: false,
    onSuccess (data) {
      dispatch(validateConfigOwnerInLineWithStakeManager(data[0].owner))
    },
    onError (err) {
      console.log('error fetching data from stake manager.', { cause: err })
    }
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
        <StakingToken stakingToken={token} chainId={chainId} />
      </>
    )
  }

  const LoadingRow = <tr><td colSpan={3}>Loading info from stakemanager... If , refreshing the page might help</td></tr>
  return <>{LoadingRow}</>
}
