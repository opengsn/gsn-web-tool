import { useContractRead, useContractEvent } from 'wagmi'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { fetchRelayData } from '../../Relay/relaySlice'

import relayHubAbi from '../../../contracts/relayHub.json'
import StakeManagerAbi from '../../../contracts/stakeManager.json'

export default function HubAuthorizedListener() {
  const relay = useAppSelector((state) => state.relay.relay)
  const relayUrl = useAppSelector((state) => state.relay.relayUrl)

  const dispatch = useAppDispatch()
  const { data: stakeManagerAddressData } = useContractRead({ addressOrName: relay.relayHubAddress, contractInterface: relayHubAbi }, 'getStakeManager',
    {
      watch: false,
      onError(err) { console.warn(err) }
    }
  )
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  useContractEvent(
    {
      addressOrName: stakeManagerAddress,
      contractInterface: StakeManagerAbi
    },
    'HubAuthorized',
    () => {
      dispatch(fetchRelayData(relayUrl)).catch(console.error)
    }
  )

  if (stakeManagerAddressData !== undefined) {
    return <span>Listening for HubAuthorized</span>
  }
  return <></>
}
