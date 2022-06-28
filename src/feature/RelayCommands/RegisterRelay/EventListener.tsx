import { useContractEvent } from 'wagmi'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { fetchRelayData } from '../../Relay/relaySlice'

import { Address } from '@opengsn/common/dist/types/Aliases'
import StakeManagerAbi from '../../../contracts/stakeManager.json'

export default function EventListener({ stakeManagerAddress }: {stakeManagerAddress: Address}) {
  const relayUrl = useAppSelector((state) => state.relay.relayUrl)
  const dispatch = useAppDispatch()

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

  return <>Listening on {stakeManagerAddress}</>
}
