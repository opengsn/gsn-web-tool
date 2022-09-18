import { memo } from 'react'
import Table from 'react-bootstrap/Table'
import { useAccount, useContractRead } from 'wagmi'

import { useAppSelector, useStakeManagerAddress } from '../../../hooks'
import { PingResponse } from '../../../types/PingResponse'

import StakeInfo from './StakeInfo'
import relayHubAbi from '../../../contracts/relayHub.json'
import PingResponseData from './PingResponseData'

function Info () {
  const relayData: PingResponse = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)

  const {
    data: stakeManagerAddressData,
    isFetching,
    isLoading
  } = useStakeManagerAddress(relayData.relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const THead = () => <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Value
      </th>
      <th>
        Extra
      </th>
    </tr>
  </thead>

  const TBody = () => {
    const StakeMananagerInfoPreparePlaceholder = () => <>
      <tr><td>Current Owner</td><td>loading</td><td></td></tr>
      <tr><td>staking token</td><td>loading</td><td></td></tr>
    </>

    if (stakeManagerAddress === undefined) return
    return (
      <tbody>
        {stakeManagerIsReady
          ? <StakeInfo stakeManagerAddress={stakeManagerAddress} relayManagerAddress={relayData.relayManagerAddress} />
          : <StakeMananagerInfoPreparePlaceholder />
        }
      </tbody>
    )
  }

  const stakeManagerIsReady = stakeManagerAddress !== undefined && !(isLoading || isFetching)
  return (
    <Table striped bordered size="sm">
      <THead />
      <tbody>
        <PingResponseData relayData={relayData} />
        {stakeManagerIsReady
          ? <StakeInfo stakeManagerAddress={stakeManagerAddress} relayManagerAddress={relayData.relayManagerAddress} />
          : null
        }
      </tbody>
    </Table >
  )
}

export default Info
