import { PingResponse } from '../../../../types'
import Balance from './Balance'
import BlockExplorerUrl from '../../components/BlockExplorerUrl'
import RelayStatus from './RelayStatus'
import RelayUrl from './RelayUrl'
import { RelayVersion } from './RelayVersion'
import { ViewDetailsButton } from './ViewDetailsButton'
import { Box, TableCell, TableRow } from '../../../../components/atoms'

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
      <TableCell>
        <RelayUrl url={url} />
      </TableCell>
      <TableCell>
        <RelayStatus ready={ready} />
      </TableCell>
      <TableCell>
        <RelayVersion version={version} />
      </TableCell>
      <TableCell>
        <Box display='flex' flexDirection='column'>
          <Box>
            <BlockExplorerUrl url={blockExplorer?.url} address={relayManagerAddress} />
          </Box>
          <Box>
            <BlockExplorerUrl url={blockExplorer?.url} address={relayWorkerAddress} />
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Balance address={relayManagerAddress} chainId={parseInt(chainId)} />
        </Box>
        <Box>
          <Balance address={relayWorkerAddress} chainId={parseInt(chainId)} />
        </Box>
      </TableCell>
      <TableCell>
        <ViewDetailsButton url={url} />
      </TableCell>
    </TableRow>
  )
}
