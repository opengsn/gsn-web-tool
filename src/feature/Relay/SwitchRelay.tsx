import Button from 'react-bootstrap/Button'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../../hooks'
import { deleteRelayData } from './relaySlice'

export default function SwitchRelayButton ({ autoFocus, abortFetch }: { autoFocus?: boolean, abortFetch?: unknown }) {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const handleDeleteRelayData = () => {
    searchParams.delete('relayUrl')
    setSearchParams(searchParams)
    if (abortFetch !== undefined) {
      const abortFetchFunc = abortFetch as Function
      abortFetchFunc()
    }
    dispatch(deleteRelayData()).catch(console.error)
  }
  return (<Button variant="secondary"
    className="my-2"
    onClick={handleDeleteRelayData}
    autoFocus={autoFocus !== undefined ? autoFocus : false}
  >Switch relay</Button>)
}
