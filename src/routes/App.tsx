import React from 'react'
import { useAccount } from 'wagmi'

import MetamaskButton from '../components/MetamaskButton'
import Relay from '../feature/Relay/Relay'

import Container from 'react-bootstrap/Container'

export default function App () {
  const { address, connector, isConnected, status } = useAccount()

  return (
    <div className="App">
      <Container fluid className="my-1">
        {
          (connector !== undefined && address !== undefined && isConnected && status === 'connected')
            ? <>
              <Relay />
            </> : <MetamaskButton />
        }
      </Container>
    </div>
  )
}
