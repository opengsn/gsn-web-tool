import { useNetwork, useSwitchNetwork } from 'wagmi'

import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'

import LoadingButton from './LoadingButton'

interface chainIdHandlerProps {
  relayChainId: number
}

export default function ChainIdHandler ({ relayChainId }: chainIdHandlerProps) {
  const { chain } = useNetwork()
  const { error, isLoading, switchNetwork } = useSwitchNetwork({ chainId: relayChainId })

  return (<>
    <Col md="3"></Col>
    <Col>
      <Alert variant='warning'>
        <Alert.Heading>Wrong chain</Alert.Heading>
        <p>Wallet is connected to ID #{chain?.id} while the relay is on #{relayChainId}</p>
        {isLoading ? <LoadingButton /> : null}
        {error !== null
          ? <Alert variant='danger'>Chain ID check failed: {error?.message}</Alert>
          : null}
        {switchNetwork !== undefined && !isLoading
          ? <Button variant='primary' onClick={() => switchNetwork(relayChainId)}>Switch network</Button>
          : null}
      </Alert>
    </Col>
    <Col></Col>
  </>)
}
