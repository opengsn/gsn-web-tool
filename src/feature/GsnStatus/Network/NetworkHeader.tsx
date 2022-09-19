import React from 'react'
import { Card } from 'react-bootstrap'

interface NetworkCardHeaderProps {
  networkAnchor: string
  group: string
  name: string
}

function NetworkHeader ({ networkAnchor, group, name }: NetworkCardHeaderProps) {
  return (<Card.Header id={networkAnchor}>
    <h2>Network: {group} - {name}</h2>
  </Card.Header>)
}

export default React.memo(NetworkHeader)
