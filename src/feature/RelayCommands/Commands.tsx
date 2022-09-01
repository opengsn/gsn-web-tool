import { useAccount } from 'wagmi'
import Button from 'react-bootstrap/Button'

import { isSameAddress } from '../../utils/utils'

import RegisterRelay from './RegisterRelay/RegisterRelay'
import DeregisterRelay from './DeregisterRelay/DeregisterRelay'

import { useAppSelector } from '../../hooks'
import MetamaskButton from '../../components/MetamaskButton'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export default function RelayCommands () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { address, isConnected } = useAccount()

  const GrayedOutButtons = () => {
    return (
      <OverlayTrigger placement={'bottom'} trigger={['hover', 'click']} defaultShow={true} delay={300} overlay={
        <Tooltip>Connect to the owner account to enable actions</Tooltip>
      }>
        <Button
          aria-controls="register-relay-form"
          variant="outline-primary"
          className="mt-2"
          disabled
        >
          Register
        </Button>
      </OverlayTrigger >
    )
  }

  const isOwner = address !== undefined && isSameAddress(address, relay.ownerAddress)
  if (address === undefined || !isOwner) {
    return <>
      {!isConnected ? <MetamaskButton /> : null}
      <GrayedOutButtons />
    </>
    // return <GrayedOutButtons />
  }

  return (
    <>
      <RegisterRelay />
    </>
  )
}
