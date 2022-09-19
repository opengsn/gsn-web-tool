import { Link } from 'react-router-dom'

export interface ViewDetailsButtonProps {
  url: string
}

export function ViewDetailsButton ({ url }: ViewDetailsButtonProps) {
  return (
    <Link to={`manage?relayUrl=${url}`}>
      <span>View details</span>
    </Link>
  )
}
