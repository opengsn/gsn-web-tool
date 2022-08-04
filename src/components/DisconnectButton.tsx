import Button from 'react-bootstrap/Button'
import { useDisconnect } from 'wagmi'
import { deleteRelayData } from '../feature/Relay/relaySlice'
import { useAppDispatch } from '../hooks'

export default function DisconnectButton () {
  const { disconnect } = useDisconnect()

  const dispatch = useAppDispatch()

  return (
    <div className="row">
      <Button onClick={() => {
        dispatch(deleteRelayData())
        disconnect()
      }}>Disconnect wallet</Button>
    </div>
  )
}
