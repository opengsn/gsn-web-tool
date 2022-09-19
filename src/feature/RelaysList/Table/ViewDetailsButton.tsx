import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

export interface ViewDetailsButtonProps {
  url: string
}

export function ViewDetailsButton ({ url }: ViewDetailsButtonProps) {
  return (
    <Link to={`manage?relayUrl=${url}`}>
      <Button>View details</Button>
    </Link>
  )
}
