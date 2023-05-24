import { Box, Typography } from '../../../../components/atoms'

export interface RelayStatusProps {
  ready: boolean
}

export default function RelayStatus({ ready }: RelayStatusProps) {
  return (
    <Box component='span' sx={{ color: ready ? 'success.main' : 'warning.main' }}>
      <Typography variant='body2'> {ready ? 'Ready' : 'Pending'}</Typography>
    </Box>
  )
}
