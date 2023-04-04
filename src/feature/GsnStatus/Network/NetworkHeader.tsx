import React from 'react'
import { CardHeader } from '../../../components/atoms/Card'

interface NetworkCardHeaderProps {
  networkAnchor: string
  group: string
  name: string
}

function NetworkHeader({ networkAnchor, group, name }: NetworkCardHeaderProps) {
  return (
    <CardHeader
      title={
        <h2>
          Network: {group} - {name}
        </h2>
      }
    />
  )
}

export default React.memo(NetworkHeader)
