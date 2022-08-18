import Button from 'react-bootstrap/Button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../../hooks'
import { deleteRelayData } from './relaySlice'
import { ArrowReturnLeft } from 'react-bootstrap-icons'

export default function NavigateBackButton ({ autoFocus, abortFetch }: { autoFocus?: boolean, abortFetch?: unknown }) {
  const navigate = useNavigate()
  const handleDeleteRelayData = () => {
    navigate(-1)
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
