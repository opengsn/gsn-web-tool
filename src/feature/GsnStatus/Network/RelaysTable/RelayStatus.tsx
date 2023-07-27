import { useTheme } from '@mui/material'
import { Typography } from '../../../../components/atoms'
import { Chip } from '../../../../components/atoms/Chip'

export interface RelayStatusProps {
  ready: boolean
}

export default function RelayStatus({ ready }: RelayStatusProps) {
  const theme = useTheme()
  return (
    <Chip
      bgcolor={ready ? theme.palette.primary.chipBGSuccess : theme.palette.primary.chipBGPending}
      label={
        <Typography color={ready ? theme.palette.primary.mainPos : theme.palette.primary.chipTextPending} variant='h5'>
          {ready ? 'Ready' : 'Pending'}
        </Typography>
      }
    />
  )
}
