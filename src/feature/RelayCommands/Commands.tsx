import { useAccount } from 'wagmi'
import Button from 'react-bootstrap/Button'

import { isSameAddress } from '@opengsn/common'

import RegisterRelay from './RegisterRelay/RegisterRelay'
import DeregisterRelay from './DeregisterRelay/DeregisterRelay'

import { useAppSelector } from '../../hooks'

export default function RelayCommands () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { address } = useAccount()

  const GrayedOutButtons = () => {
    return (<>
      <Button
        aria-controls="register-relay-form"
        variant="primary"
        className="mt-2"
        disabled
      >
        Register
      </Button>
      <Button
        aria-controls="register-relay-form"
        variant="danger"
        className="mt-2"
        disabled
      >
        Deregister
      </Button>
    </>)
  }

  if (address === undefined ||
    (address !== undefined && !isSameAddress(address, relay.ownerAddress))) {
    return <GrayedOutButtons />
  }

  return (
    <>
      <RegisterRelay />
      <DeregisterRelay />
    </>
  )
}
