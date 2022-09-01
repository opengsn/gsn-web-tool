import { PingResponse } from '../../../types/PingResponse'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import Balance from './Balance'
import BlockExplorerUrl from './BlockExplorerUrl'
import RelayStatus from './RelayStatus'
import RelayUrl from './RelayUrl'
import { RelayVersion } from './RelayVersion'
import { ViewDetailsButton } from './ViewDetailsButton'

export interface RelayLineProps {
  url: string
  relay: PingResponse
  blockExplorer?: { name: string, url: string }
  errorMsg: string
}

export default function RelayLine ({ url, relay, blockExplorer, errorMsg }: RelayLineProps) {
  const { relayManagerAddress, relayWorkerAddress, version, chainId } = relay
  if (chainId === undefined) return <tr><td>no data</td></tr>

  return <tr key={relayManagerAddress}>
    <td>
      <RelayUrl url={url} />
    </td>
    <td>
      <RelayStatus ready />
    </td>
    <td>
      <RelayVersion version={version} />
    </td>
    <td>
      <BlockExplorerUrl url={blockExplorer?.url} address={relayManagerAddress} />
      <br />
      <BlockExplorerUrl url={blockExplorer?.url} address={relayWorkerAddress} />
    </td>
    <td>
      <Balance
        address={relayManagerAddress}
        chainId={parseInt(chainId)} />
      <br />
      <Balance
        address={relayWorkerAddress}
        chainId={parseInt(chainId)} />
    </td>
    <td><ViewDetailsButton url={url} /></td>
  </tr>
}
