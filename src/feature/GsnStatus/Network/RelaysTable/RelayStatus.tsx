import { colors } from '../../../../theme'
import { Box } from '../../../../components/atoms'

export interface RelayStatusProps {
  ready: boolean
}

export default function RelayStatus({ ready }: RelayStatusProps) {
  return (
    <Box component='span' sx={{ color: ready ? colors.lightGreen : colors.warning }}>
      {ready ? 'Ready' : 'pending'}
    </Box>
  )
}
