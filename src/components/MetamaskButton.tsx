import { useConnect } from 'wagmi'
import Button from 'react-bootstrap/Button'

export default function MetamaskButton () {
  const { connect, connectors, error, pendingConnector } = useConnect()

  return (
    <>
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect with {connector.name}
          {!connector.ready && ' (unsupported)'}
          {connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
      ))}
      {(error != null) && <div>{error.message}</div>}
    </>
  )
}
