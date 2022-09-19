import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import { ChainWithGsn } from '../../../../types'
import BlockExplorerUrl from '../../components/BlockExplorerUrl'
import { GsnNetworkRelay } from '../../networkListSlice'
import Balance from './Balance'
import RelayLine from './RelayLine'
import RelayUrl from './RelayUrl'

interface RelaysTableProps {
  relays: GsnNetworkRelay[]
  chain: ChainWithGsn
}

export default function RelaysTable ({ relays, chain }: RelaysTableProps) {
  const TableHead = () => (<thead>
    <tr>
      <th>url</th>
      <th>status</th>
      <th>version</th>
      <th><abbr title="manager/worker">address</abbr></th>
      <th>balance</th>
    </tr>
  </thead>)

  const TableBody = () => {
    const content = relays.map((x) => {
      if (x.config !== undefined) {
        return <RelayLine key={x.manager} relay={x.config} errorMsg={''} url={x.url} blockExplorer={chain.blockExplorers?.default} />
      } else {
        return (<tr key={x.manager}>
          <td><RelayUrl url={x.url} /></td>
          <td colSpan={2}>
            <span className="text-danger">{x.errorMsg}</span>
          </td>
          <td>
            <BlockExplorerUrl address={x.manager} url={chain.blockExplorers?.default.url} />
          </td>
          <td><Balance address={x.manager} chainId={chain.id} /></td>
          <td></td>
        </tr>)
      }
    })

    return <tbody>{content}</tbody>
  }

  return <div className="mx-3">
    <Table hover responsive>
      <TableHead /><TableBody />
    </Table >
  </div>
}
