import { useConnect } from 'wagmi'
import { Button } from 'react-bootstrap'

export default function MetamaskButton() {
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect()

  return (
    <div className="row">
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
        >
          Connect with {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
      ))}

      {(error != null) && <div>{error.message}</div>}
    </div>
  )
}
