import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

import NetworkHeader from './NetworkHeader'
import RelayHubInfo from './RelayHubInfo'

import RelayLine from '../Table/RelayLine'
import RelayUrl from '../Table/RelayUrl'
import Balance from '../Table/Balance'

import { INetwork } from '../networkListSlice'
import BlockExplorerUrl from '../Table/BlockExplorerUrl'

interface NetworkCardProps {
  network: INetwork
}
export default function GsnStatusNew ({ network }: NetworkCardProps) {
  const { relays, chain } = network
  const { relayHubAddress, RelayHubAbi } = chain.gsn

  const RelaysTable = () => {
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
            <td><Button disabled>View details</Button></td>
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

  return <Card className="mt-4">
    <NetworkHeader networkAnchor={chain.network} group={chain.gsn.group} name={chain.name} />
    <RelayHubInfo
      blockExplorerUrl={chain.blockExplorers?.default.url}
      relayHubAddress={relayHubAddress}
      RelayHubAbi={RelayHubAbi}
      chainId={chain.id} />
    <RelaysTable />
  </Card>
}
