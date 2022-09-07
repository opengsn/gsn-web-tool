import { PingResponse } from '../../../types/PingResponse'
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
      <div><BlockExplorerUrl url={blockExplorer?.url} address={relayManagerAddress} /></div>
      <div><BlockExplorerUrl url={blockExplorer?.url} address={relayWorkerAddress} /></div>
    </td>
    <td>
      <Balance
        address={relayManagerAddress}
        chainId={parseInt(chainId)} />
      <Balance
        address={relayWorkerAddress}
        chainId={parseInt(chainId)} />
    </td>
    <td className="border-top"><ViewDetailsButton url={url} /></td>
  </tr>
}
