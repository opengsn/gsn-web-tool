import { useEffect } from 'react'
import { Chain, useAccount, useBlockNumber, useConnect, useNetwork } from 'wagmi'
import RelayListList from './RelayListList'
import { NetworkLinks } from './components/NetworkLinks'
import GsnStatusNew from './GsnStatusNew'
import { ChainWithGsn } from '../../networks'

export default function RelayListHeader () {
  const { connector: activeConnector, isConnected } = useAccount()
  const { data } = useBlockNumber({ chainId: 5 })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { chain, chains } = useNetwork()

  const gsnChains = chains as ChainWithGsn[]
  if (gsnChains[0].gsn === undefined) return <span>Loading chains</span>
  console.log(gsnChains)

  return <div>
    {gsnChains.map((x) => {
      return <div key={x.name}>
        {x.gsn.relayHubAddress !== 'undefined' ? <GsnStatusNew network={x} /> : null}
      </div>
    })}
  </div>
}
