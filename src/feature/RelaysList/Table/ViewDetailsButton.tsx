import Button from 'react-bootstrap/Button'
import { Link, useNavigate } from 'react-router-dom'

export interface ViewDetailsButtonProps {
  url: string
}

export function ViewDetailsButton ({ url }: ViewDetailsButtonProps) {
  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate(`manage?relayUrl=${url}`)}>View details</Button>
  )
}
