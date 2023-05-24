import React from 'react'
import { Typography } from '../../../components/atoms'

interface NetworkCardHeaderProps {
  networkAnchor: string
  group: string
  name: string
}

function NetworkHeader({ networkAnchor, group, name }: NetworkCardHeaderProps) {
  return (
    <Typography variant='h5' fontWeight={600}>
      Network: {group} - {name}
    </Typography>
  )
}

export default React.memo(NetworkHeader)
