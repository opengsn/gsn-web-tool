import { useBlockNumber } from 'wagmi'

interface RelayListProps { chainId: number }

export default function RelayListList ({ chainId }: RelayListProps) {
  const { data } = useBlockNumber({ chainId, onError (data) { console.log(data) } })
  return <><span>{data}</span><hr /></>
}
