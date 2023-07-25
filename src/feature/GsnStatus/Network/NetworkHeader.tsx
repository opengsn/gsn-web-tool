import React from 'react'
import { Typography } from '../../../components/atoms'

interface NetworkCardHeaderProps {
  group: string
  name: string
}

function NetworkHeader({ group, name }: NetworkCardHeaderProps) {
  return (
    <Typography variant='h2' fontWeight={600}>
      {group} - {name}
    </Typography>
  )
}

export default React.memo(NetworkHeader)
