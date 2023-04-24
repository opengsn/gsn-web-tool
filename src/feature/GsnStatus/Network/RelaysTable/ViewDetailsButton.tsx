import { createSearchParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import { Box, Button, Typography } from '../../../../components/atoms'

export interface ViewDetailsButtonProps {
  url: string
}

export function ViewDetailsButton({ url }: ViewDetailsButtonProps) {
  const navigate = useNavigate()
  return (
    <Box width='150px' ml='auto'>
      <Button.Contained
        onClick={() => navigate({ pathname: ROUTES.DetailedView, search: createSearchParams({ relayUrl: url }).toString() })}
      >
        <Typography variant='body2'>View details</Typography>
      </Button.Contained>
    </Box>
  )
}
