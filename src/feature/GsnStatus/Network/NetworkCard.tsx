import Card from 'react-bootstrap/Card'

import NetworkHeader from './NetworkHeader'
import RelayHubInfo from './RelayHubInfo'
import RelaysTable from './RelaysTable/RelaysTable'

import { INetwork } from '../networkListSlice'

interface NetworkCardProps {
  network: INetwork
}

export default function NetworkCard ({ network }: NetworkCardProps) {
  const { relays, chain } = network
  const { relayHubAddress, RelayHubAbi } = chain.gsn

  return <Card className="mt-4">
    <NetworkHeader networkAnchor={chain.network} group={chain.gsn.group} name={chain.name} />
    <RelayHubInfo
      blockExplorerUrl={chain.blockExplorers?.default.url}
      relayHubAddress={relayHubAddress}
      RelayHubAbi={RelayHubAbi}
      chainId={chain.id} />
    <RelaysTable relays={relays} chain={chain} />
  </Card>
}
