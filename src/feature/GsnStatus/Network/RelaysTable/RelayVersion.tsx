import { Typography } from '../../../../components/atoms'

export interface IRelayVersion {
  version: string
}

export function RelayVersion({ version }: IRelayVersion) {
  return <Typography variant='body2'>{version.replace(/\+opengsn.*/, '')}</Typography>
}
