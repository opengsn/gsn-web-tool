import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../hooks'
import { INetwork } from '../networkListSlice'

interface NetGroup {
  [key: string]: INetwork[]
}

export default function NetworkLinksNew () {
  const networks = useAppSelector((state) => state.networkList.networks)
  const networkArray = Object.values(networks)
  const netGroups = networkArray.map(n => n.group).reduce((set: NetGroup, g: string) => ({
    ...set, [g]: networkArray.filter(net => net.group === g && net.errorMsg === '')
  }), {})

  return <ListGroup variant="flush">
    {Object.keys(netGroups).filter(g => netGroups[g].length > 0).map((g) => {
      return <ListGroup.Item key={g} className="p-1">
        <span>{g}:{' '}</span>
        <span>
          {netGroups[g].map((net: INetwork, index: number) =>
            <span key={net.chain.id}>{index > 0 ? ', ' : ''}
              <Link to={{ hash: `#${net.chain.network}` }}>{net.chain.name}</Link> ({net.activeRelays})
            </span>
          )}
        </span>
      </ListGroup.Item>
    })}
  </ListGroup>
}
