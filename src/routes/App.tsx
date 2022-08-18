import React from 'react'
import { useAccount } from 'wagmi'

import Relay from '../feature/Relay/Relay'

import NavigateBackButton from '../feature/Relay/NavigateBackButton'
import MetamaskButton from '../components/MetamaskButton'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

export default function App () {
  const { address, connector, isConnected, status } = useAccount()

  return (
    <div className="App">
      <Container fluid className="my-1">
        <Row>
          <NavigateBackButton />
          {
            (connector !== undefined && address !== undefined && isConnected && status === 'connected')
              ? <>
                <Relay />
              </> : <MetamaskButton />
          }
        </Row>
      </Container>
    </div>
  )
}
