import React from 'react'
import { Box } from '../../../components/atoms'

const sx = {
  root: {
    display: 'flex',
    alignItems: 'center',
    p: '8px'
  }
}

const Header = () => {
  return (
    <Box sx={sx.root}>
      <Box component='img' src='favicon.ico' height='50px' alt='icon' />
      <Box mx={1}>
        <h2>GSN (v3.0.0-beta.3) Relay Servers</h2>
        <b>Note</b> This is the status page of the new GSN v3.0.0-beta.3 network. For the previous GSN v2 network see{' '}
        <a href='https://relays-v2.opengsn.org'>here</a>
      </Box>
      <hr />
    </Box>
  )
}

export default React.memo(Header)
