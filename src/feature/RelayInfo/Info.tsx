import { isSameAddress, PingResponse } from '@opengsn/common'
import { ethers } from 'ethers'
import { Table } from 'react-bootstrap'
import { useAccount, useBalance, useContractRead } from 'wagmi'

import relayHubAbi from '../../contracts/relayHub.json'
import { useAppSelector } from '../../hooks'
import StakeInfo from './StakeInfo'

function Info () {
  const relay = useAppSelector((state) => state.relay)
  const relayUrl: string = relay.relayUrl
  const relayData: PingResponse = relay.relay

  const { address } = useAccount()

  const { data: relayManagerBalanceData } = useBalance({ addressOrName: relayData.relayManagerAddress })
  const { data: relayWorkerBalanceData } = useBalance({ addressOrName: relayData.relayWorkerAddress })
  const { data: ownerAddressBalance } = useBalance({ addressOrName: relayData.ownerAddress })

  const { data: stakeManagerAddressData, isLoading, isFetching } = useContractRead({
    addressOrName: relayData.relayHubAddress,
    contractInterface: relayHubAbi,
    functionName: 'getStakeManager',
    watch: false,
    onError (err) { console.warn(err) }
  })

  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const RelayUrl = () => { return <span>{relayUrl}</span> }
  const camelCaseToHuman = (s: string): string => {
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const PingResponseData = () => {
    return (<>
      {Object.keys(relayData).map((x, i) => {
        let data
        if (x === 'relayManagerAddress') {
          data = (
            <>
              <td>
                {camelCaseToHuman(x)}
              </td>
              <td>{(relayData[x as keyof PingResponse])?.toString()}</td>
              <td>
                <span>{relayManagerBalanceData?.formatted}</span>{' '}
                <b>{relayManagerBalanceData?.symbol}</b>
              </td>
            </>
          )
        } else if (x === 'relayWorkerAddress') {
          data = (
            <>
              <td>{camelCaseToHuman(x)}</td>
              <td>{(relayData[x as keyof PingResponse])?.toString()}</td>
              <td>
                <span>{relayWorkerBalanceData?.formatted}</span>{' '}
                <b>{relayWorkerBalanceData?.symbol}</b>
              </td>
            </>
          )
        } else if (x === 'ownerAddress' && address !== undefined) {
          const accountIsOwner = isSameAddress(relayData[x], address)
          data = (
            <>
              <td>{camelCaseToHuman(x)}</td>
              <td>
                {(relayData[x as keyof PingResponse])?.toString()}
              </td>
              <td>
                <b>{ accountIsOwner ? '()'
                  : 'switch to owner to enable actions' }</b>
              </td>
            </>
          )
        } else if (x === 'minMaxPriorityFeePerGas') {
          data = (
            <>
              <td>{camelCaseToHuman(x)}</td>
              <td>{ethers.utils.formatEther(relayData.minMaxPriorityFeePerGas)}</td>
              <td><b>Native currency, value in ethers</b></td>
            </>
          )
        } else if (x === 'ready') {
          data = (
            <>
              <td>{camelCaseToHuman(x)}</td>
              <td>{relayData[x as keyof PingResponse] === true
                ? <span>ready</span>
                : <span>not ready</span>}
              </td>
              <td></td>
            </>
          )
        } else {
          data = (
            <>
              <td>{camelCaseToHuman(x)}</td>
              <td>{(relayData[x as keyof PingResponse])?.toString()}</td>
              <td></td>
            </>
          )
        }

        return <tr key={i}>{data}</tr>
      })}
    </>)
  }

  return (
    <Table striped bordered size="sm">
      <thead>
        <tr>
          <th>
            key
          </th>
          <th>
            value
          </th>
          <th>
            balance
          </th>
        </tr>
      </thead>
      <tbody>
        <PingResponseData />
        { (isFetching || isLoading) && stakeManagerAddress !== undefined
          ? <>
            <tr><td>Current Owner</td><td>loading</td><td></td></tr>
            <tr><td>staking token</td><td>loading</td><td></td></tr>
          </>
          : <StakeInfo stakeManagerAddress={stakeManagerAddress} relayManagerAddress={relayData.relayManagerAddress} />
        }
      </tbody>
    </Table>
  )
}
export default Info
