import { ChainWithGsn } from '../../../../types'
import BlockExplorerUrl from '../../components/BlockExplorerUrl'
import { GsnNetworkRelay } from '../../networkListSlice'
import Balance from './Balance'
import RelayLine from './RelayLine'
import RelayUrl from './RelayUrl'
import { Box } from '../../../../components/atoms'
import Table, { TableRow } from '../../../../components/atoms/Table'
import { colors } from '../../../../theme'

interface RelaysTableProps {
  relays: GsnNetworkRelay[]
  chain: ChainWithGsn
}

export default function RelaysTable({ relays, chain }: RelaysTableProps) {
  const TableHead = () => (
    <thead>
      <tr>
        <th>url</th>
        <th>status</th>
        <th>version</th>
        <th>
          <abbr title='manager/worker'>address</abbr>
        </th>
        <th>balance</th>
      </tr>
    </thead>
  )

  const TableBody = () => {
    const content = relays.map((x) => {
      if (x.config !== undefined) {
        return <RelayLine key={x.manager} relay={x.config} errorMsg={''} url={x.url} blockExplorer={chain.blockExplorers?.default} />
      } else {
        return (
          <TableRow key={x.manager}>
            <td>
              <RelayUrl url={x.url} />
            </td>
            <td colSpan={2}>
              <Box component='span' color={colors.red}>
                {x.errorMsg}
              </Box>
            </td>
            <td>
              <BlockExplorerUrl address={x.manager} url={chain.blockExplorers?.default.url} />
            </td>
            <td>
              <Balance address={x.manager} chainId={chain.id} />
            </td>
            <td></td>
          </TableRow>
        )
      }
    })

    return <tbody>{content}</tbody>
  }

  return (
    <Box mx='15px'>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </Box>
  )
}
