import Button from 'react-bootstrap/Button'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../../hooks'
import { deleteRelayData } from './relaySlice'
import { ArrowReturnLeft } from 'react-bootstrap-icons'

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
    dispatch(deleteRelayData())
  }
  return (<div className="p-3 col-1">
    <div className="row"><Button variant="secondary"
      className="rounded-pill"
      onClick={handleDeleteRelayData}
      autoFocus={autoFocus !== undefined ? autoFocus : false}>
      <ArrowReturnLeft />
    </Button>
    </div>  </div>)
}
