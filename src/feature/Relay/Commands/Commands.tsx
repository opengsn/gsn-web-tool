import { useAccount } from 'wagmi'

import { useAppSelector } from '../../../hooks'
import { isSameAddress } from '../../../utils'

import RegisterRelay from './RegisterRelay/RegisterRelay'

import MetamaskButton from '../components/MetamaskButton'

export default function RelayCommands() {
  const relay = useAppSelector((state) => state.relay.relay)
  const { address, isConnected } = useAccount()

  const isOwner = address !== undefined && isSameAddress(address, relay.ownerAddress)
  if (address === undefined || !isOwner) {
    return <>{!isConnected ? <MetamaskButton /> : null}</>
  }

  return (
    <>
      <RegisterRelay />
    </>
  )
}
