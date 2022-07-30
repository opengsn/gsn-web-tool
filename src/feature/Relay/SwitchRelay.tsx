import Button from 'react-bootstrap/Button'
import { useAppDispatch } from '../../hooks'
import { deleteRelayData } from './relaySlice'

export default function SwitchRelayButton () {
  const dispatch = useAppDispatch()
  const handleDeleteRelayData = () => {
    dispatch(deleteRelayData()).catch(console.error)
  }
  return (<Button variant="secondary"
    className="my-2 rounded-pill"
    onClick={handleDeleteRelayData}
  >{' ↩ '}</Button>)
}
