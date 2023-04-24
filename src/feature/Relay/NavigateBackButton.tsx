import { useNavigate } from 'react-router-dom'
import { Box, Button } from '../../components/atoms'

export default function NavigateBackButton({ autoFocus, abortFetch }: { autoFocus?: boolean; abortFetch?: unknown }) {
  const navigate = useNavigate()
  const handleDeleteRelayData = () => {
    navigate(-1)
  }

  return (
    <Box p={1}>
      <Button.Contained onClick={handleDeleteRelayData}>Back</Button.Contained>
    </Box>
  )
}
