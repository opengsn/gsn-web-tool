import { PingResponse } from '../../../../types'
import Balance from './Balance'
import BlockExplorerUrl from '../../components/BlockExplorerUrl'
import RelayStatus from './RelayStatus'
import RelayUrl from './RelayUrl'
import { RelayVersion } from './RelayVersion'
import { ViewDetailsButton } from './ViewDetailsButton'
import { TableRow } from '../../../../components/atoms'

export interface RelayLineProps {
  url: string
  relay: PingResponse
  blockExplorer?: { name: string, url: string }
  errorMsg: string
}

export default function RelayLine({ url, relay, blockExplorer, errorMsg }: RelayLineProps) {
  const { relayManagerAddress, relayWorkerAddress, ready, version, chainId } = relay
  if (chainId === undefined) {
    return (
      <TableRow>
        <td>no data</td>
      </TableRow>
    )
  }

  return (
    <TableRow key={relayManagerAddress}>
      <td>
        <RelayUrl url={url} />
      </td>
      <td>
        <RelayStatus ready={ready} />
      </td>
      <td>
        <RelayVersion version={version} />
      </td>
      <td>
        <div>
          <BlockExplorerUrl url={blockExplorer?.url} address={relayManagerAddress} />
        </div>
        <div>
          <BlockExplorerUrl url={blockExplorer?.url} address={relayWorkerAddress} />
        </div>
      </td>
      <td>
        <Balance address={relayManagerAddress} chainId={parseInt(chainId)} />
        <Balance address={relayWorkerAddress} chainId={parseInt(chainId)} />
      </td>
      <td>
        <ViewDetailsButton url={url} />
      </td>
    </TableRow>
  )
}
