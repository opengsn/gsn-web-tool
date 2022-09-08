import { useAccount } from 'wagmi'
import Button from 'react-bootstrap/Button'

import { isSameAddress } from '../../utils/utils'

import RegisterRelay from './RegisterRelay/RegisterRelay'
import DeregisterRelay from './DeregisterRelay/DeregisterRelay'

import { useAppSelector } from '../../hooks'
import MetamaskButton from '../../components/MetamaskButton'

export default function RelayCommands () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { address, isConnected } = useAccount()

  const GrayedOutButtons = () => {
    return (
      <>
        <Button
          aria-controls="register-relay-form"
          variant="outline-primary"
          className="mt-2"
          disabled
        >
          Register
        </Button>
      </>
    )
  }

  const isOwner = address !== undefined && isSameAddress(address, relay.ownerAddress)
  if (address === undefined || !isOwner) {
    return <>
      {!isConnected ? <MetamaskButton /> : null}
      <GrayedOutButtons />
    </>
  }

  return (
    <>
      <RegisterRelay />
    </>
  )
}
