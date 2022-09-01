export interface IRelayVersion {
  version: string
}

export function RelayVersion ({ version }: IRelayVersion) {
  return <span>
    {version.replace(/\+opengsn.*/, '')}
  </span>
}
