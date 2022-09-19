import { createSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'

export interface ViewDetailsButtonProps {
  url: string
}

export function ViewDetailsButton ({ url }: ViewDetailsButtonProps) {
  return (
    <Link to={{ pathname: ROUTES.DetailedView, search: createSearchParams({ relayUrl: url }).toString() }}>
      <span>View details</span>
    </Link>
  )
}
