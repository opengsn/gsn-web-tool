import { createSearchParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import { Box, Button, Icon } from '../../../../components/atoms'

export interface ViewDetailsButtonProps {
  url: string
}

export function ViewDetailsButton({ url }: ViewDetailsButtonProps) {
  const navigate = useNavigate()
  return (
    <Box ml='auto'>
      <Button.Icon onClick={() => navigate({ pathname: ROUTES.DetailedView, search: createSearchParams({ relayUrl: url }).toString() })}>
        <Icon.ChevronRight />
      </Button.Icon>
    </Box>
  )
}
