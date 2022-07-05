import React from 'react'
import { useAccount } from 'wagmi'

import MetamaskButton from '../components/MetamaskButton'
import DisconnectButton from '../components/DisconnectButton'
import Relay from '../feature/Relay/Relay'

import Container from 'react-bootstrap/Container'

export default function App () {
  const { data: account, error, isError, isLoading, isFetched, status } = useAccount()

  return (
    <div className="App">
      <Container className="my-1">
        {isError
          ? <span>{error?.message}</span> : <span>{isError}</span>
        }
        {
          (account?.connector !== undefined && account !== undefined && isFetched && !isLoading && !isError && status === 'success')
            ? <>
              <Relay />
              <hr />
              <DisconnectButton />
            </> : <MetamaskButton />
        }
      </Container>
    </div>
  )
}
