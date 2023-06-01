import React from 'react'
import { Typography } from '../../../components/atoms'

interface NetworkCardHeaderProps {
  group: string
  name: string
}

function NetworkHeader({ group, name }: NetworkCardHeaderProps) {
  return (
    <Typography variant='h5' fontWeight={600}>
      Network: {group} - {name}
    </Typography>
  )
}

export default React.memo(NetworkHeader)
