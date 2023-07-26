import { PingResponse } from '../../../../types'
import Balance from './Balance'
import BlockExplorerUrl from '../../components/BlockExplorerUrl'
import RelayStatus from './RelayStatus'
import RelayUrl from './RelayUrl'
import { RelayVersion } from './RelayVersion'
import { ViewDetailsButton } from './ViewDetailsButton'
import { Box, TableCell, TableRow } from '../../../../components/atoms'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'

export interface RelayLineProps {
  url: string
  relay: PingResponse
  blockExplorer?: { name: string, url: string }
  errorMsg: string
}

export default function RelayLine({ url, relay, blockExplorer, errorMsg }: RelayLineProps) {
  const { relayManagerAddress, relayWorkerAddress, ready, version, chainId } = relay
  const navigate = useNavigate()
  if (chainId === undefined) {
    return (
      <TableRow>
        <td>no data</td>
      </TableRow>
    )
  }

  return (
    <TableRow
      key={relayManagerAddress}
      onClick={() => navigate({ pathname: ROUTES.DetailedView, search: createSearchParams({ relayUrl: url }).toString() })}
    >
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
        <Box display='flex' flexDirection='column' gap={1}>
          <Box display='flex' justifyContent='space-between' width='95px'>
            <BlockExplorerUrl url={blockExplorer?.url} address={relayManagerAddress} />
          </Box>
          <Box display='flex' justifyContent='space-between' width='95px'>
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
