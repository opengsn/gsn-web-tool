export interface RelayStatusProps {
  ready: boolean
}

export default function RelayStatus ({ ready }: RelayStatusProps) {
  return <span className={ready ? 'text-success' : 'text-warning'}>
    {ready ? 'Ready' : 'pending'}{' '}
  </span>
}
