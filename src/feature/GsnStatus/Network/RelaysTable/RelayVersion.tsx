import { useTheme } from '@mui/material'
import { Typography } from '../../../../components/atoms'

export interface IRelayVersion {
  version: string
}

export function RelayVersion({ version }: IRelayVersion) {
  const theme = useTheme()
  return (
    <Typography variant='h6' color={theme.palette.primary.mainBrightWhite}>
      {version.replace(/\+opengsn.*/, '')}
    </Typography>
  )
}
