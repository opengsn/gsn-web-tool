import { useConnect } from 'wagmi'
import { Button, Row, Col } from 'react-bootstrap'

export default function MetamaskButton () {
  const { connect, connectors, error, pendingConnector } = useConnect()

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '75vh' }}>
      <div className="text-center">
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
      </div>
    </div>
  )
}
