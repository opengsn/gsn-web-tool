import {useContractRead} from 'wagmi'
import {useAppSelector} from '../../../hooks'

import EventListener from './EventListener'
import relayHubAbi from '../../../contracts/relayHub.json'

export default function HubAuthorizedListener() {
  const relay = useAppSelector((state) => state.relay.relay)

  alert(relay.relayHubAddress)
  const {data: stakeManagerAddressData} = useContractRead({
    addressOrName: relay.relayHubAddress,
    contractInterface: relayHubAbi
  },
    'getStakeManager',
    {
      watch: false,
      onError(err) { console.error(err) }
    }
  )
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  if (stakeManagerAddressData !== undefined) {
    return <EventListener stakeManagerAddress={stakeManagerAddress} />
  }
  return <>Failed to fetch stakeManagerAddress</>
}
